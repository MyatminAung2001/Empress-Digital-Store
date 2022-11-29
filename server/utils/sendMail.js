import mailgun from 'mailgun-js';

export const MailGun = () => {
    mailgun({
        apiKey: process.env.API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    })
};

export const sendOrderEmailTemplate = (order) => {
    return (
        `
            <h1>Thanks For Shopping At Empress.</h1>
            <p>Hi ${order.user.name}</p>
            <p>We have finised processing your order</p>
            <h3>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h3>
            <ul>
                ${order.orderItems.map((item) => `
                    <li>
                        ${item.name}
                    </li>
                    <li>
                        ${item.quantity}
                    </li>
                    <li>
                        ${item.price.toFixed(2)}
                    </li>
                `).join('\n')}
            </ul>
            <p>Items Price: $${order.itemsPrice.toFixed(2)}</p>
            <p>Delivery Fee: $${order.deliveryPrice.toFixed(2)}</p>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            <p>Payment: ${order.paymentMethod}</p>
            <h3>Shipping Address</h3>
            <p>
                ${order.deliveryAddress.fullName},<br/>
                ${order.deliveryAddress.address},<br/>
                ${order.deliveryAddress.city},<br/>
                ${order.deliveryAddress.addressState},<br/>
            </p>
            <hr/>
            <h3>Empress, Your trusted partner.</h3>
        ` 
    )
}