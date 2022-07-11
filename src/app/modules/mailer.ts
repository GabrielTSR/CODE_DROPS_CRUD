import path from 'path';
import nodemailer, { TransportOptions } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

const secure = process.env.MAILER_PORT == '' + 465;

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

//@ts-ignore
const transport = nodemailer.createTransport(transportObject);

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

export default transport;
