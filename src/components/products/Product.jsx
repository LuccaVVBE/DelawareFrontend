import { useParams } from 'react-router'
import { useEffect } from 'react'
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai'

import '../../styles/product.css'

import useProductStore from '../../stores/productStore'

import Loader from '../Loader'
import Error from '../Error'

export default function Product() {
    const { id } = useParams()
    const {
        cart,
        fetchSingleProduct,
        singleProduct: product,
        addOneToCart,
        removeOneFromCart,
        loading,
        error,
    } = useProductStore((state) => state)

    useEffect(() => {
        fetchSingleProduct(id)
        // eslint-disable-next-line
    }, [])
    const handleAddOneToCart = () => {
        addOneToCart(id)
    }

    const handleRemoveOneFromCart = () => {
        removeOneFromCart(id)
    }
    return (
        <div className="product">
            <Loader loading={loading} />
            <Error error={error} />
            {!loading && !error ? (
                <>
                    <h1 data-cy="product-name">
                        {product.productDescription
                            ? product.productDescription.productName
                            : null}
                    </h1>
                    <div
                        className="product-info-box"
                        data-cy="product-info-box"
                    >
                        <img
                            src={
                                product.linkToImg
                                    ? product.linkToImg
                                    : 'https://cdn.shopify.com/s/files/1/1040/0152/products/WHOOP-Shopify-BANDs-800x800-SuperKnit-LUX-Ivy-Gold.png'
                            }
                            alt="Link to img"
                        ></img>
                        <div>
                            <div className="priceAndButtons">
                                <h3
                                    className="productPrice"
                                    data-cy="product-price"
                                >
                                    {product.productPrice
                                        ? product.productPrice[0].price
                                        : null}{' '}
                                    {product.productPrice
                                        ? product.productPrice[0].currencyId
                                        : null}
                                </h3>
                                <div className="cardButtons">
                                    <button
                                        className="cardButton"
                                        data-cy="product-remove"
                                    >
                                        <AiOutlineMinusSquare
                                            onClick={handleRemoveOneFromCart}
                                        />
                                    </button>
                                    <span
                                        className="wantedQuantity"
                                        data-cy="product-wantedQuantity"
                                    >
                                        {cart.find(
                                            (item) => item.id === product.id
                                        )?.wantedQuantity || 0}
                                    </span>
                                    <button
                                        className="cardButton"
                                        data-cy="product-add"
                                    >
                                        <AiOutlinePlusSquare
                                            className="active"
                                            onClick={handleAddOneToCart}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="stock" data-cy="product-stock">
                                Stock: {product.stock}
                            </div>
                            <div
                                className="estimatedShippingDays"
                                data-cy="product-eta"
                            >
                                Estimated shipping time: {product.eta} days
                            </div>
                            <div
                                className="description"
                                data-cy="product-description"
                            >
                                {product.productDescription
                                    ? product.productDescription
                                          .productLongDescription
                                    : null}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}
