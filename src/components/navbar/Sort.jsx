import useProductStore from './../../stores/productStore'
import { useNavigate } from 'react-router-dom'

export default function Sort() {
    const setSortOption = useProductStore((state) => state.setSortOption)
    const navigate = useNavigate()

    const handleSortOrderChange = (event) => {
        setSortOption(event.target.value)
        navigate('/')
    }

    return (
        <label className="bottom-nav-box">
            Sort by {'  '}
            <select
                className="nav-selector-box"
                data-cy="sort-selector"
                onChange={handleSortOrderChange}
            >
                <option value="name-asc">Name ascending</option>
                <option value="name-des">Name descending</option>
                <option value="price-asc">Price ascending</option>
                <option value="price-des">Price descending</option>
            </select>
        </label>
    )
}
