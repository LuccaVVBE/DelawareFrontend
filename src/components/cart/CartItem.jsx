import useProductStore from './../../stores/productStore'
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai'

import { useNavigate } from 'react-router-dom'
import { formatToCurrency } from '../../util/global-functions'

export default function CartItem({ product }) {
    const { addOneToCart, removeOneFromCart } = useProductStore((state) => {
        return { ...state }
    })

    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/products/${product.id}`)
    }

    return (
        <div className="cartItem" data-cy="cartItem" key={product.id}>
            <div
                className="product-image"
                style={{ cursor: 'pointer' }}
                onClick={handleCardClick}
            >
                <img
                    src={
                        product.linkToImg
                            ? product.linkToImg
                            : 'https://cdn.shopify.com/s/files/1/1040/0152/products/WHOOP-Shopify-BANDs-800x800-SuperKnit-LUX-Ivy-Gold.png'
                    }
                    alt="product img"
                />
            </div>
            <div
                className="product "
                style={{ cursor: 'pointer' }}
                onClick={handleCardClick}
            >
                <h3 data-cy="cartProductName">{product.productName}</h3>
                <p>{product.shortDescription}</p>
            </div>
            <div className="price">
                <div className="amountInCart">
                    <button>
                        <AiOutlineMinusSquare
                            className="addAndRemoveButtons"
                            data-cy="cartRemove"
                            onClick={() => removeOneFromCart(product.id)}
                        />
                    </button>
                    <span data-cy="amountInCart">{product.wantedQuantity}</span>
                    <button>
                        <AiOutlinePlusSquare
                            className="active addAndRemoveButtons"
                            onClick={() => addOneToCart(product.id)}
                        />
                    </button>
                </div>
                <div className="price">
                    <span>
                        {formatToCurrency(product.price * product.wantedQuantity)}
                    </span>
                </div>
            </div>
        </div>
    )
}
