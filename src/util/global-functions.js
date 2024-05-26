import currency from 'currency.js'

const EURO = (value) => 
    currency(value, { symbol: '€', decimal: ',', separator: '.' })




function calculatePriceExclVAT(itemList) {
    let priceExclVAT = currency(0)
    itemList.forEach((product) => {
        priceExclVAT = currency(priceExclVAT).add(
            currency(product.price).multiply(product.wantedQuantity? product.wantedQuantity : product.quantity ? product.quantity : 1)
        )
    })
    return priceExclVAT.value
}

function calculateVAT(itemList) {
    let VAT = currency(0)
    itemList.forEach((product) => {
        VAT = currency(VAT).add(
            product.price * (product.wantedQuantity ? product.wantedQuantity : product.quantity ? product.quantity : 1)  * 0.21
        )
    })
    return VAT.value
}

function calculateTotal(itemList) {
    return currency(calculatePriceExclVAT(itemList)).add(calculateVAT(itemList))
}

function formatToCurrency(value) {
    return EURO(value).format()
}

function calculateShipping(order) {
    let shipping = currency(0)
    order?.packingType === "Regular cardboard" ? shipping = currency(49.99) : order?.packingType === "Tailer made cardboard" ? shipping = currency(70.99) : shipping = currency(0)
        
     return shipping.value
}


const getEstimatedDeliveryDate = (itemList) => {
    if (itemList.length === 0) {
        return 'Yesterday'
    }
    const date = new Date()
    date.setDate(
        date.getDate() + Math.max(...itemList.map((product) => product.eta))
    )
    return date.toDateString()
}

const cardBoardPrice = (option) => {
    if (option === 'Tailer made cardboard') return '  70.99 EUR'
    return '  49.99 EUR'
}

export {
    getEstimatedDeliveryDate,
    calculatePriceExclVAT,
    calculateVAT,
    calculateTotal,
    formatToCurrency,
    cardBoardPrice,
    calculateShipping

}