import '../../styles/productList.css'

import ProductCard from './ProductCard'
import Loader from '../Loader'
import Error from '../Error'

import useProductStore from '../../stores/productStore'

export default function ProductList() {
    const { cart, addOneToCart, removeOneFromCart, loading, error } =
        useProductStore((state) => state)
    const products = useProductStore((state) => state.filteredProducts())

    if (products.length === 0 && !loading && !error)
        return <h1 style={{ margin: '3rem' }}>No products found</h1>

    return (
        <>
            <div data-cy="product-list" className="productList">
                <Loader loading={loading} />
                <Error error={error} />
                {!loading && !error ? (
                    <>
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                wantedQuantity={
                                    cart.find((item) => item.id === product.id)
                                        ?.wantedQuantity
                                }
                                addOneToCart={addOneToCart}
                                removeOneFromCart={removeOneFromCart}
                            />
                        ))}
                    </>
                ) : null}
            </div>
        </>
    )
}
