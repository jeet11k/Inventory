while True:
    name = input("Enter your name: ")
    if name.lower() == 'exit':
        print("Exiting the program. Goodbye!")
        break
    print(f'Hi {name}!')
