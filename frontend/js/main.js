fetch('http://localhost:5000/index')
    .then((res) => res.json())
    .then((data) => console.log(data)) 