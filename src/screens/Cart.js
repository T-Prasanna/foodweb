import React from 'react'
import Delete from '@material-ui/icons/Delete'
import { useCart, useDispatchCart } from '../components/ContextReducer';
import '../styles/Cart.css';

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className="cart-container">
        <div className='m-5 w-100 text-center fs-3 empty-cart'>🛒 The Cart is Empty!</div>
      </div>
    )
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");

    try {
      let response = await fetch("http://localhost:5000/api/auth/orderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toISOString()
        })
      });

      let res = await response.json();
      console.log("Checkout Response:", res);

      if (res.success) {
        alert("✅ Order placed successfully!");
        dispatch({ type: "DROP" });
      } else {
        alert("⚠️ Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("❌ Something went wrong!");
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="cart-container">
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
          <thead className='fs-4'>
            <tr>
              <th scope='col'></th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn p-0 delete-btn">
                   <Delete onClick={() => dispatch({ type: "REMOVE", index })} />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className='fs-2'>Total Price: {totalPrice}/-</h1>
        </div>
        <div>
          <button className='btn bg-success mt-5 checkout-btn' onClick={handleCheckOut}>
            ✅ Check Out
          </button>
        </div>
      </div>
    </div>
  )
}
