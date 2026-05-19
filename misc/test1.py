# Step 1: Create empty list
marks = []

# Step 2: Take input for 5 students
for i in range(5):
    mark = int(input("Enter mark: "))
    marks.append(mark)

# Step 3: Print all marks
print("\nStudent Marks:")

for mark in marks:
    print(mark)

# Step 4: Calculate details
highest = max(marks)
lowest = min(marks)
total = sum(marks)
average = total / len(marks)

# Step 5: Print results
print("\nHighest Mark:", highest)
print("Lowest Mark:", lowest)
print("Total Marks:", total)
print("Average Marks:", average)