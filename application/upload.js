async function uploadData() {

  for (let i = 1; i <= 20; i++) {

    const laptop = {
      name: `Laptop-${i}`,
      category: 'Laptop',
      quantity: 5,
      location: 'Warehouse',
      status: 'Available',
      notes: 'Dummy data'
    };

    try {

      const response = await fetch('https://inventory-1-k5dw.onrender.com/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(laptop)
      });

      const data = await response.text();

      console.log(data);

    } catch (error) {

      console.log(error);

    }

  }

}

uploadData();