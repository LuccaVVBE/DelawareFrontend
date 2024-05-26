import useProductStore from './../../stores/productStore'

export default function SearchBar() {
    const searchProducts = useProductStore((state) => state.searchProducts)

    const handleSearch = (event) => {
        searchProducts(event.target.value)
    }

    return (
        <div className="search-bar bottom-nav-box ">
            <input
                className="search-input"
                type="text"
                placeholder="Search products..."
                onChange={handleSearch}
            />
        </div>
    )
}
