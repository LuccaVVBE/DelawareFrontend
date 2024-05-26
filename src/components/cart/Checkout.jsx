import { useState } from 'react'
import '../../styles/checkout.css'
import { Link } from 'react-router-dom'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import ProgressBar from '@ramonak/react-progress-bar'
import useOrderStore from '../../stores/orderStore'
import Error from '../Error'
import Loader from '../Loader'
import useCustomerStore from '../../stores/customerStore'
import { useAuth0 } from '@auth0/auth0-react'
import { cardBoardPrice } from '../../util/global-functions'

export default function Checkout() {
    const [step, setStep] = useState(1)
    const { order, error, loading } = useOrderStore((state) => state)
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm({
        mode: 'onChange',
    })
    const { getAccessTokenSilently } = useAuth0()

    const [orderId, setOrderId] = useState(null)

    const onSubmit = async (data) => {
        data = {
            packingType:
                data.packingType !== undefined
                    ? data.packingType
                    : 'Tailer made cardboard',
            address: {
                country: data.country,
                zipCode: data.zipCode,
                city: data.city,
                street: data.street,
                number: data.houseNum,
            },
        }
        const orderId = await order(getAccessTokenSilently, data)
        // set orderId to state so that step3 can use orderId once isSubmitSuccessful is true
        if (orderId) setOrderId(orderId)
    }

    const CustomProgressBar = () => {
        return (
            <ProgressBar
                className="bar"
                height="100%"
                bgColor="#ec4842"
                customLabel={'Step ' + step + '/2'}
                completed={(step / 2) * 100}
            />
        )
    }

    return (
        <>
            <Error error={error} />
            <Loader loading={loading}></Loader>{' '}
            {!loading && !error ? (
                !isSubmitSuccessful ? (
                    <FormProvider
                        handleSubmit={handleSubmit}
                        errors={errors}
                        register={register}
                        isSubmitting={isSubmitting}
                        trigger={trigger}
                    >
                        <div className="checkoutpage"></div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {step === 1 ? (
                                <Step1
                                    setStep={setStep}
                                    bar={CustomProgressBar}
                                />
                            ) : (
                                <Step2
                                    setStep={setStep}
                                    bar={CustomProgressBar}
                                />
                            )}
                        </form>
                    </FormProvider>
                ) : (
                    <div className="checkout">
                        <div className="compHeader">
                            <h2 data-cy="invoiceSent">Invoice sent</h2>
                            <Link
                                to={`/orders/${orderId}`}
                                className="linkToOrderPage"
                            >
                                head to order page
                            </Link>
                        </div>
                    </div>
                )
            ) : null}
        </>
    )
}

function Step1({ setStep, bar }) {
    const { trigger } = useFormContext()
    let company = useCustomerStore.getState().company
    if (!company)
        company = {
            addresses: [
                {
                    country: '',
                    zipCode: '',
                    city: '',
                    street: '',
                    number: '',
                },
            ],
        }

    const handleNext = async () => {
        const isValid = await trigger([
            'country',
            'zipCode',
            'street',
            'houseNum',
        ])
        if (isValid) setStep(2)
    }

    return (
        <div className="checkout">
            <div className="compHeader">
                <h2>Checkout</h2>
                {bar()}
                <button className="primary" data-cy="next" onClick={handleNext}>
                    Next
                </button>
            </div>
            <legend>Please provide us your delivery adress:</legend>
            <LabelInput
                label="Country"
                name="country"
                type="text"
                value={company.addresses[0]?.country}
            />{' '}
            <LabelInput
                label="ZipCode"
                name="zipCode"
                type="text"
                value={company.addresses[0]?.zipCode}
            />{' '}
            <LabelInput
                label="City"
                name="city"
                type="text"
                value={company.addresses[0]?.city}
            />{' '}
            <LabelInput
                label="Street"
                name="street"
                type="text"
                value={company.addresses[0]?.street}
            />
            <LabelInput
                label="House number"
                name="houseNum"
                type="text"
                value={company.addresses[0]?.number}
            />
        </div>
    )
}

function Step2({ setStep, bar }) {
    const { isSubmitting } = useFormContext()
    const handlePrevious = () => {
        setStep(1)
    }

    return (
        <div className="checkout">
            {' '}
            <div className="compHeader">
                <button
                    className="primary"
                    onClick={handlePrevious}
                    data-cy="previous-button"
                >
                    Previous
                </button>{' '}
                {bar()}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="primary"
                >
                    Submit
                </button>
            </div>
            <legend>Please continue with your preferred packing type:</legend>
            {[
                { name: 'Regular cardboard', defaultChecked: false },
                {
                    name: 'Tailer made cardboard',
                    defaultChecked: true,
                },
            ].map((packingType) => (
                <LabelInput
                    label={packingType.name}
                    name="packingType"
                    type="radio"
                    key={packingType.name}
                    defaultChecked={packingType.defaultChecked}
                />
            ))}
        </div>
    )
}

function LabelInput({ label, name, type, defaultChecked, value, ...rest }) {
    const { register, errors, isSubmitting } = useFormContext()

    const hasError = name in errors

    return (
        <div className={type === 'text' ? 'mb-3' : 'form-check'}>
            <label htmlFor={name} className="form-label">
                {label} {defaultChecked === true ? '(suggested)' : ''}
            </label>
            <input
                data-cy={`input-${name}`}
                {...register(name, validationRules[name])}
                id={name}
                defaultChecked={defaultChecked}
                defaultValue={type === 'radio' ? label : value}
                type={label !== 'ZipCode' ? type : 'number'}
                className={
                    type === 'text' ? 'form-control' : 'form-check-input'
                }
                disabled={isSubmitting}
                {...rest}
            />
            {type === 'radio' ? cardBoardPrice(label) : ''}
            {hasError ? (
                <div className="form-text text-danger">
                    {errors[name].message}
                </div>
            ) : null}
        </div>
    )
}

const validationRules = {
    country: {
        required: 'Country is required',
    },
    zipCode: {
        required: 'Zipcode is required',
        valueAsNumber: true,
        min: 1,
    },
    city: {
        required: 'City is required',
    },
    street: {
        required: 'Street is required',
    },
    houseNum: {
        required: 'House number is required',
    },
}
