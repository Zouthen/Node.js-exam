<script>
  import toastr from "toastr";
  import "toastr/build/toastr.css";
  import { onMount } from 'svelte';

  let items = [];
  let email = '';

  async function fetchItems() {
    const response = await fetch('/api/shopwares');
    items = await response.json();
    items.forEach(item => item.orderQuantity = 0);
  }

  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }
  function validateOrder() {
    for (const item of items) {
      if (item.orderQuantity > item.stock) {
        toastr.warning(`Cannot order ${item.orderQuantity} units of ${item.name}. Only ${item.stock} in stock.`)
        return false;
      }
    }
    return true;
  }

  async function placeOrder() {
    if (!email || !validateEmail(email)) {
      toastr.info("Please enter a valid email address.");
      return;
    }
    if (!validateOrder()) {
      return;
    }

    const orders = items.filter(item => item.orderQuantity > 0)
                        .map(item => ({ id: item.id, name: item.name , quantity: item.orderQuantity }));

    if (orders.length === 0) {
      toastr.info("Please order at least one item.")
      return;
    }
    
    const response = await fetch('/api/shopwares/bulk-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders, email })
    });

    if (response.ok) {
      fetchItems();
      items.forEach(item => item.orderQuantity = 0);
      email = '';
      toastr.success("Your order has been placed. A confirmation email will be sent.");
    } else {
      const error = await response.json();
      toastr.error(`Error: ${error.message}`);
    }
  }

  onMount(fetchItems);
</script>

<style>
  .table-container {
      width: 75%; 
      margin: auto;
    }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #f4f4f4;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f4f4f4;
  }
  img {
    width: 100px;
    height: auto;
  }
  input[type='number'], input[type='email'] {
    width: 100%;
  }
</style>

<h1>Shop</h1>
<div class="table-container">
<h3>Customer Info</h3>
<input type="email" bind:value={email} placeholder="Enter your email address" required />

<br><br>

<h3>Items</h3>
<table>
  <thead>
    <tr>
      <th></th>
      <th>Name</th>
      <th>Stock</th>
      <th>Order Quantity</th>
    </tr>
  </thead>
  <tbody>
    {#each items as item}
      <tr>
        <td><img src="{item.image_url}" alt="{item.name}"></td>
        <td>{item.name}</td>
        <td>{item.stock}</td>
        <td>
          <input type="number" min="0" max={item.stock} bind:value={item.orderQuantity} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<br>
</div>
<button on:click={placeOrder}>Place Order</button>
