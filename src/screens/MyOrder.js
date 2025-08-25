import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/MyOrder.css';
export default function MyOrder() {
  const [orderData, setOrderData] = useState([])

  const fetchMyOrder = async () => {
    let userEmail = localStorage.getItem("userEmail")

    try {
      let response = await fetch("http://localhost:5000/api/auth/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userEmail })
      })

      let res = await response.json()
      console.log("MyOrders Response:", res)

      if (res.success) {
        setOrderData(res.orderData)
      } else {
        setOrderData([])
      }
    } catch (error) {
      console.error("Fetch MyOrders Error:", error)
    }
  }

  useEffect(() => {
    fetchMyOrder()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">My Orders</h2>

        {orderData.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orderData.map((order, orderIndex) => (
            <div key={orderIndex} className="mb-4 p-3 border rounded shadow-sm bg-light">
              {/* Each order contains an array of items, with first element as Order_date */}
              <h4 className="order-title">Order Details</h4>
              <h5>
                Date:{" "}
                {order[0]?.Order_date
                  ? new Date(order[0].Order_date).toLocaleString()
                  : "Unknown"}
              </h5>
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Size</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.slice(1).map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{item.size}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  )
}
