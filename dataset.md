```mermaid
classDiagram
class Generic{
        +__class_getitem__()
        +__init_subclass__()
    }
    class DataLoader{
        +dataset: Dataset[Any]
        +batch_size: Optional[int]
        +num_workers: int
        +pin_memory: bool
        +drop_last: bool
    }
    class DatasetFolder{
        +make_dataset()
        +find_classes()
        +__getitem__()
    }
    class ImageFolder{
        +root : String
    }
    class VisionDataset{
        +__getitem__()
        + __repr__()
        +_format_transform_repr()
        +extra_repr()
    }
    class Dataset{
        +__getitem__()
        +__add__()
    }
    class Optimizer{
    }
    class Adam{
        +params: params_t
        +lr :float = 1e-4
        +weight_decay : float = 1e-5
        +zero_grad()
        +step()
    }
    class catDataset{
        +image_path: String
        +mask_path: String
        +__getitem__()
        +__len__()
        +load_file()
        +toTensor()
    }
    DatasetFolder <|-- ImageFolder
    VisionDataset <|-- DatasetFolder
    Dataset <|-- VisionDataset
    Generic <|-- Dataset
    Dataset <|-- catDataset
    Generic <|-- DataLoader
    Optimizer <|-- Adam
```