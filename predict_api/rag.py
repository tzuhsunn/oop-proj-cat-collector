from langchain_community.document_loaders import TextLoader
# Create a TextLoader instance with the path to your text file
loader = TextLoader('cats-dogs.txt')
# Load the data from the text file
data = loader.load()

# Split
from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size = 512,
                                               chunk_overlap  = 10,
                                               length_function = len,
                                               is_separator_regex = False)

all_splits = text_splitter.split_documents(data)

# Add to vectorDB
from langchain_community.embeddings import HuggingFaceEmbeddings 
embeddings = HuggingFaceEmbeddings(model_name='shibing624/text2vec-base-chinese', 
                                   model_kwargs={'device': 'cuda'}) 

from langchain_community.vectorstores import FAISS
vectorstore = FAISS.from_documents(all_splits, embeddings)


# define Retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# define llm
from langchain_community.llms import HuggingFaceTextGenInference
llm = HuggingFaceTextGenInference(
    inference_server_url="http://localhost:8080/",
    top_k=10,
    top_p=0.95,
    typical_p=0.95,
    temperature=0.01,
    repetition_penalty=1.03,
)

# define chain
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.pydantic_v1 import BaseModel
# Prompt
from langchain.prompts import PromptTemplate


template = """你是一位知道貓貓狗狗的專家。請根據context回答問題，不知道就說不知道。
context
{context}
endcontext
USER: {question} ASSISTANT: """

prompt = PromptTemplate(input_variables=["context", "question"], template=template)

# RAG chain
chain = (
    RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
    | prompt
    | llm
    | StrOutputParser()
)

# Add typing for input
class Question(BaseModel):
    __root__: str

chain = chain.with_types(input_type=Question)

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from langserve import add_routes

app = FastAPI()

@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/cat-dog/playground")


add_routes(app, chain, path="/cat-dog")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)