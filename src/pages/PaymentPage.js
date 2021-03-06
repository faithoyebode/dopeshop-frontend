import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentPage = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);

    const { shippingAddress } = cart;

    if(!shippingAddress){
        history.push('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('paystack');
    

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check 
                            type='radio' 
                            label='Paystack' 
                            id='paystack' 
                            name='paymentMethod'
                            value='paystack'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                        <Form.Check 
                            type='radio' 
                            label='Flutterwave' 
                            id='flutterwave' 
                            name='paymentMethod'
                            value='flutterwave'
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentPage;
