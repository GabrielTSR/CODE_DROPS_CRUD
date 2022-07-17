import path from 'path';
import nodemailer, { TransportOptions } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

//Checking if the MAILER_PORT is secure
const secure = process.env.MAILER_PORT == String(465);

//Creating the transportObject
const transportObject = {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
};

//Creating the transporter with the transport object
const transport = nodemailer.createTransport(transportObject as TransportOptions);

//Configuring configuration for the email template
transport.use(
    'compile',
    hbs({
        viewEngine: {
            defaultLayout: undefined,
            partialsDir: path.resolve('./src/resources/mail/'),
            extname: '.hbs',
        },
        viewPath: path.resolve('./src/resources/mail/'),
        extName: '.hbs',
    })
);

//Exporting the transport
export default transport;
