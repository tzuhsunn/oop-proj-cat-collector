import random
from property import properties, breeds

test = [0, 1, 2, 2, 3]
sum_list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
for i in test:
    sum_list = [a + b for a, b in zip(sum_list, properties[i])]

print(sum_list)
print(len(properties))
temp = []
for i in range(len(properties)):
    temp.append(sum([a * b for a, b in zip(sum_list, properties[i])]))

for i in test:
    temp[i] = 0

print(temp)

# Find the maximum value
max_value = max(temp)

# Find all indices of the maximum value
max_indices = [i for i, x in enumerate(temp) if x == max_value]
random_number = random.choice(max_indices)
print(random_number)