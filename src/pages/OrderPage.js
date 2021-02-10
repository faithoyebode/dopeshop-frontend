import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { PaystackButton } from 'react-paystack';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderPage = ({ match }) => {
    const orderId = match.params.id;

    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    
    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const userDetails = useSelector(state => state.userLogin.userInfo);
    const { email } = userDetails;

    //const paymentMethod = useSelector(state => state.cart.paymentMethod);

    if(!loading){
        //Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        }

        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
        

    }

    const paystackAmount = Math.round(order?.totalPrice * 100);

    const paystackConfig = {
        reference: (new Date()).getTime(),
        email,
        amount: paystackAmount || 0,
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC,
    };
      
    const handlePaystackSuccessAction = (paymentResult) => {
        // Implementation for whatever you want to do with reference and after success call.
        dispatch(payOrder(orderId, paymentResult, order.paymentMethod));
    }

    const handlePaystackCloseAction = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed');
    }
    
    const paystackComponentProps = {
        ...paystackConfig,
        text: 'Pay with Paystack',
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction
    };
    
    const flutterwaveConfig = {
        public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC,
        tx_ref: Date.now(),
        amount: order?.totalPrice ?? 0,
        currency: 'NGN',
        payment_options: 'card',
        customer: {
          email
        },
        customizations: {
          title: 'Dopeshop online store',
          description: 'Payment for items in cart',
          logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        }
    };

    const fwConfig = {
        ...flutterwaveConfig,
        text: 'Pay with Flutterwave!',
        callback: (reference) => {
            dispatch(payOrder(orderId, reference, order.paymentMethod));
            closePaymentModal(); // this will close the modal programmatically
        },
        onClose: () => {},
    };

    useEffect(() => {
        if(!order || successPay ){
            dispatch({ type: ORDER_PAY_RESET });
        }
        dispatch(getOrderDetails(orderId));
    }, //eslint-disable-next-line
    [dispatch, successPay]);

    
    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : 
        <>
            <h1>Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, 
                                {order.shippingAddress.city}{' '} 
                                {order.shippingAddress.postalCode},{' '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? 
                                <Message>Order is empty</Message> : 
                                (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image 
                                                            src={item.image}
                                                            alt={item.name}
                                                            fluid rounded
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {
                                !order.isPaid && (
                                    <ListGroup.Item>
                                        {
                                            loadingPay ?
                                            <Loader /> :
                                            order.paymentMethod === 'paystack' ?
                                            <PaystackButton {...paystackComponentProps} className="paystack-btn" /> :
                                            <FlutterWaveButton {...fwConfig}  className="flutterwave-btn" />
                                        }
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
}

//eslint-disable-next-line
export default OrderPage;
