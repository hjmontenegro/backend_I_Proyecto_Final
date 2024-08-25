// Conectar al servidor de Socket.io
const socket = io();


function updateCartList(cart) {
  const cartList = document.getElementById('cart-items');
  const emptyCartMessage = document.getElementById('empty-cart');
  if (!cartList) {
      console.error('Cart list element not found');
      return;
  }
  cartList.innerHTML = ''; // Limpiar lista de carritos

  if (!cart || !cart.products || cart.products.length === 0) {
      emptyCartMessage.style.display = 'block';
  } else {
      emptyCartMessage.style.display = 'none';
      cart.products.forEach(item => {
          const product = item.product;
          const cartItem = document.createElement('li');
          cartItem.className = 'list-group-item';
          cartItem.id = `cart-${product._id}`;
          cartItem.innerHTML = `
              <div class="d-flex justify-content-between align-items-center">
                  <div>
                      <strong>Title:</strong> ${product.title || 'undefined'} <br>
                      <strong>Quantity:</strong> <span id="cart-quantity-${product.id}">${item.quantity}</span>
                  </div>
                  <div>
                      <button class="btn btn-sm btn-danger" onclick="RemoveFromCart('${product.id}', '${item.quantity}')">Remove</button>
                  </div>
              </div>`;
          cartList.appendChild(cartItem);
      });
  }
}



// Función para agregar un producto al carrito
const addToCart = async (productId) => {



fetch(`/api/carts/1/product/${productId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(cart => {
    console.log('Product added to cart:', cart);
    //socket.emit('cartUpdated', cart);
    fetch('/api/carts/1')
      .then(response => response.json())
      .then(cart => {

          if (cart) {
              updateCartList(cart);
          } else {
              updateCartList({ products: [] });
          }
          let elemento = document.getElementById("card-text-stock-" + productId );
          elemento.innerHTML = "Stock: " + ( Number(elemento.dataset.stock) - 1).toString();

          elemento.dataset.stock -= 1;
      })
})
.catch(err => console.error('Error adding product to cart:', err));
};

const RemoveFromCart = async (productId, cantidadAcumulada) => {
  fetch(`/api/carts/1/product/${productId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(cart => {
      console.log('Product added to cart:', cart);
      //socket.emit('cartUpdated', cart);
      fetch('/api/carts/1')
        .then(response => response.json())
        .then(cart => {
            if (cart) {
                updateCartList(cart);
            } else {
                updateCartList({ products: [] });
            }
            let elemento = document.getElementById("card-text-stock-" + productId );

            elemento.innerHTML = "Stock: " + ( Number(elemento.dataset.stock) + Number(cantidadAcumulada)).toString();

            elemento.dataset.stock = Number(elemento.dataset.stock) +  Number(cantidadAcumulada)
          })
  })
  .catch(err => console.error('Error adding product to cart:', err));
  };


socket.on('cartUpdated', (cart) => {
  updateCartList(cart);
});

//agregar productos al carrito
socket.on("ProductAdd", async (data) => {
    try {

        console.log("Error al refrescar un Producto");

        /*let cart = await cartModel.findOne();
        if (!cart) {
            cart = new cartModel();
        }*/
        
        /*const product = await productsModel.findById(productId);
        
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            if (product.stock > 0) {
                existingProduct.quantity += 1;
                product.stock -= 1;
                await cart.save();
                await product.save();
                console.log("Cantidad del producto actualizada en el carrito");
            } else {
                console.log('Stock insuficiente');
                return
            }
        } else {
            cart.products.push({ product: productId, quantity: 1 });
            product.stock -= 1;
            await cart.save();
            await product.save();
            console.log("Producto agregado al carrito correctamente");
        }*/

    } catch (error) {
        console.error("Error al refrescar un Producto", error);
    }
});

// Escuchar el evento Product Update y actualizar la vista
socket.on("Product Update", (updatedProduct) => {
  console.log("Producto Actualizado:", updatedProduct);

  const stockElement = document.querySelector(
    `p[data-product-ids="${updatedProduct._id}"]`
  );

  if (stockElement) {
    // Actualizar el stock en la vista
    stockElement.innerHTML = `Stock: ${updatedProduct.stock}`;
  }
});

function promptAddToCart(productId) {
  return addToCart(productId, parseInt(productId));
}

// Añadir eventos a los botones de "Agregar al Carrito"
document.addEventListener("DOMContentLoaded", () => {
  //updateCartLink();
  //window.Swal = Swal;
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      promptAddToCart(productId);      
    });
  });
  fetch('/api/carts/1')
  .then(response => response.json())
  .then(cart => {
      if (cart) {
          updateCartList(cart);
      } else {
          updateCartList({ products: [] });
      }
  })
  .catch(err => console.error('Error fetching cart:', err));
});