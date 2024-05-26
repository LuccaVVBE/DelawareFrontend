
export default function OrderItems({ product }) {

    return (
        <div className="orderItem" key={product.productId}>
            <div className="product-image-in-order">
                <img
                    src={
                        product.linkToImg
                            ? product.linkToImg
                            : 'https://cdn.shopify.com/s/files/1/1040/0152/products/WHOOP-Shopify-BANDs-800x800-SuperKnit-LUX-Ivy-Gold.png'
                    }
                    alt="product img"
                />
            </div>
            <div className="productOrder">
                <h3 data-cy="orderProductName">{product.name}</h3>
                <p>{product.productDescription}</p>
            </div>
            <div className="priceProductOrder">


                <span data-cy="amountInOrder">
                    {product.quantity} x {' '}
                    {product.price} EUR
                </span>
            </div>
        </div>
    );
}
