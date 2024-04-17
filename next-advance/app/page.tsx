"use client"
import { use, useState } from "react";

export default function Home() {

  const [users, setUsers] = useState<{ name: string, age: number }[]>([])
  const [userData, setUserData] = useState<any>(null)
  
  const handleClick = () => {
    console.log("here")
    fetch(`http://backend-domain.com/api/get-users`)
      .then(response => response.json())
      .then(data => {
        console.log("Data", data)
        setUsers(data)
      })
      .catch(error => console.error('Error:', error));
  }

  const handleAdd = async (event : any) => {
    event.preventDefault();
    
    console.log("userDatya",userData)

    try {
      const response = await fetch('http://backend-domain.com/api/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User added successfully:', data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  return (<>
  <div style={{display: "flex", justifyContent:"center"}}>Task complete</div>
    <div style={{ display: "flex", justifyContent: "center", margin: "3rem" }}>
      <button onClick={handleClick}>Get Users data</button>
    </div>
    <div>
      {users.map((user, ind) => {
        return <div key={ind} style={{ display: "flex", justifyContent: "center" }}>Name:{user.name} and Age:{user.age}</div>
      })}
    </div>
    <div style={{ display: "flex", justifyContent: "center", margin: "3rem" }}>
      <button onClick={handleAdd}>Add User</button>
    </div>
    <div style={{ display: "flex", justifyContent: "center", margin: "3rem" }}>
      <input placeholder="name" type="text" onChange={(e) => setUserData({...userData,name: e.target.value})}/>
      <input placeholder="age" type="number" onChange={(e) => setUserData({...userData,age: Number(e.target.value)})}/>
    </div>
  </>
  );
}
