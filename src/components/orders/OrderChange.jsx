import React, { useState } from "react";
import Modal from "react-modal";

import '../../styles/editOrder.css'
import { useAuth0 } from "@auth0/auth0-react";

import useOrderStore from "../../stores/orderStore";

export default function OrderChange({ id, address }) {
  const { editOrder, fetchSingleOrder } = useOrderStore((state) => state);
  const { getAccessTokenSilently } = useAuth0();

  const [isOpen, setIsOpen] = useState(false);
  const [addr, setAddr] = useState({})
  const [localError, setLocalError] = useState(null)

  const openModal = () => {
    setIsOpen(true);
    setAddr(address ? { ...address } : {})
  }

  const closeModal = () => {
    setIsOpen(false);
    setLocalError(null)
  }

  const handleSubmit = async () => {
    if ((addr.country === "" || addr.zipCode ==="" || addr.city === "" || addr.street === "" || addr.number === "")
    ||(addr.country === address.country && addr.zipCode === address.zipCode && addr.city === address.city && addr.street === address.street && addr.number === address.number)) {
      setLocalError("Please fill in all fields or change the address")
      return
      
    }
    delete addr.id;
    delete addr.name;
    delete addr.companyId
    await editOrder(id, addr, getAccessTokenSilently);
    await fetchSingleOrder(getAccessTokenSilently, id)
    closeModal();
  };

  const handleEdit = (e) => {
    if (e.target.name === "country") {
      if (e.target.value.match(/^[a-zA-Z ]*$/))
        setAddr({ ...addr, country: e.target.value })
    }
    if (e.target.name === "zipCode") {
      if (e.target.value.match(/^[0-9]+$/))
        setAddr({ ...addr, zipCode: e.target.value })
    }
    if (e.target.name === "city") {
      if (e.target.value.match(/^[a-zA-Z]+$/))
        setAddr({ ...addr, city: e.target.value })
    }
    if (e.target.name === "street") {
      if (e.target.value.match(/^[a-zA-Z]+$/))
        setAddr({ ...addr, street: e.target.value })
    }
    if (e.target.name === "houseN") {
      if (e.target.value.match(/^[0-9]+$/))
        setAddr({ ...addr, number: e.target.value })
    }
  }

  return (
    <>
      <button className="btnEditOrder primary" onClick={openModal}>Edit order</button>
      <Modal className="windowEdit" isOpen={isOpen} onRequestClose={closeModal} ariaHideApp={false}>
        <h2 className="editTitel">Edit order</h2>
        {localError && <p className="alert alert-danger">{localError}</p>}
        <form className="editOrder">
          <div className="formEditOrder">
            <label htmlFor="country">Country</label>
            <input required type="text" name="country" value={addr?.country} onChange={handleEdit} />
            <label htmlFor="zipCode">ZIP Code</label>
            <input required type="text" name="zipCode" value={addr?.zipCode} onChange={handleEdit} />
            <label htmlFor="city">City</label>
            <input required type="text" name="city" value={addr?.city} onChange={handleEdit} />
            <label htmlFor="street">Street</label>
            <input required type="text" name="street" value={addr?.street} onChange={handleEdit} />
            <label htmlFor="houseN">House number</label>
            <input required type="text" name="houseN" value={addr?.number} onChange={handleEdit} />
          </div>
        </form>
        <div className="buttons">
          <button className="btnSave primary" onClick={handleSubmit}>Save</button>
          <button className="btnClose" onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </>
  );
}
