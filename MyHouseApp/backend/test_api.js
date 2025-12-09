import fetch from 'node-fetch';

async function testApi() {
  try {
    const response = await fetch('http://localhost:3000/api/residential/step1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        name: "John Doe",
        doorNo: "123",
        street: "Main St",
        pincode: "123456",
        area: "Downtown",
        city: "Metropolis",
        contactNo: "9876543210",
        advanceAmount: 5000,
        rentAmount: 2000
      }),
    });

    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();