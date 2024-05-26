import { memo, useEffect, useState } from 'react'

import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { formatToCurrency } from '../../util/global-functions'

import '../../styles/productCard.css'

export default memo(function ProductCard({
    id,
    productDescription,
    productPrice,
    linkToImg,
    stock,
    wantedQuantity,

    addOneToCart,
    removeOneFromCart,
}) {
    const navigate = useNavigate()
    const { productName: name, productShortDescription: description } =
        productDescription
    const { price } = productPrice[0]
    const [isAddButtonClicked, setIsAddButtonClicked] = useState(
        wantedQuantity > 0
    )

    useEffect(() => {}, [wantedQuantity])

    const handleAddOneToCart = () => {
        addOneToCart(id)
        setIsAddButtonClicked(true)
    }

    const handleRemoveOneFromCart = () => {
        if (wantedQuantity === 1) {
            setIsAddButtonClicked(false)
        }
        removeOneFromCart(id)
    }

    const handleCardClick = () => {
        navigate(`/products/${id}`)
    }

    return (
        <div className="card" data-cy="product-card">
            <div
                className="img-holder"
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
            >
                <img
                    data-cy="product-image"
                    src={
                        linkToImg
                            ? linkToImg
                            : 'https://cdn.shopify.com/s/files/1/1040/0152/products/WHOOP-Shopify-BANDs-800x800-SuperKnit-LUX-Ivy-Gold.png'
                    }
                    alt="Link to img"
                />{' '}
                <span className="stock" data-cy="product-stock">
                    Current stock: {stock}
                </span>
            </div>
            <div
                data-cy={`product-card-info${id}`}
                className="product-info"
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
            >
                <h3 data-cy="product-name">
                    {name}
                    <br />
                </h3>

                <p data-cy="product-shortDescription">{description}</p>
            </div>
            <div className="price-info">
                {isAddButtonClicked ? (
                    <div className="amountInCart">
                        <button>
                            <AiOutlineMinusSquare
                                className="addAndRemoveButtons"
                                onClick={handleRemoveOneFromCart}
                            />
                        </button>
                        <span>{wantedQuantity ? wantedQuantity : 0}</span>
                        <button>
                            <AiOutlinePlusSquare
                                className="addAndRemoveButtons"
                                onClick={handleAddOneToCart}
                                data-cy="addButton"
                            />
                        </button>
                    </div>
                ) : (
                    <div
                        data-cy="addButton"
                        className="amountInCart"
                        onClick={handleAddOneToCart}
                    >
                        Add to cart
                    </div>
                )}

                <span className="price" data-cy="product-price">
                    {formatToCurrency(price)}
                </span>
            </div>
        </div>
    )
})
