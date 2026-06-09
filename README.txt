PAYMENTS MICROSERVICE (Stripe & Webhook)

* Inicializr el microservice
    -  Crear la app
        $ nest new payments-ms
            > ? Which package manager would you ❤️  to use? npm
        $ cd payments-ms
        $ npm run start         // Run development
        $ npm run start:dev     // Run watch mode

    - Instalar dependencias
        + DotENV (Variables de entorno)
            $ npm i dotenv
        + Joi (Vaidador de Schema)
            $ npm i joi
        + Stripe
            $ npm install stripe --save
        + Validation (Validacion de la data)
            $ npm i --save class-validator class-transformer
        + Stripe CLI
            $ npm i -g @stripe/cli
        + Hookdeck CLI (Event Gateway)
            $ npm install hookdeck-cli -g

    - NestJS CLI
        + Crear un nuevo resource (Sin archivos de test)
            $ nest g res payments --no-spec
                > ? What transport layer do you use? REST API
                > ? Would you like to generate CRUD entry points? (Y/n) n

    - Postman
        + Crete a new Workspace (Click "New" | "Workspace" > "Blank workspace")
            > Name: "Ax2CDev"
              Click "Create"
        + Create a new collection (Click "+" | "Blank collection")
            > Name: "ms-nestjs-payments-ms"

        + HTTP requests
            * Payment (Click "..." > Add folder > Name: "Payment")
                - Create Payment Session
                    > POST: http://localhost:3001/payments/create-payment-session                   Click "Send"
                        > Body | raw (JSON)
                            {
                                "currency": "usd",
                                "items": [
                                    {
                                        "name": "Teclado Mecánico",
                                        "price": 100,
                                        "quantity": 2
                                    },
                                    {
                                        "name": "Mouse Mecánico",
                                        "price": 45.99,
                                        "quantity": 2
                                    }
                                ]
                            }
                - Payment Success
                    > GET: http://localhost:3001/payments/success                                   Click "Send"
                - Payment Cancel
                    > GET: http://localhost:3001/payments/cancel                                    Click "Send"
                - Stripe Webhook
                    > POST: http://localhost:3001/payments/webhook                                  Click "Send"
                        > Body | raw (JSON)
                            { }

    - GitHub
        + Create new organization (Click "+ v" | "New organization" > Free | Click "Create a free organization")
            > organization name: {{ORGANIZATION_NAME}}
            > contact email: {{CONTACT_EMAIL}}
            > [true] My personal account
            > [true] I hereby accept Terms of Service....
            Click "Next" | 
            Click "Complete setup" | "Skip this step"
        + Create new repository (Click "New")
            > {{OWNER_MS_NAME}}/payments-ms
            > Description: {{REPO_DESCRIPTION}}
            > Public
            Click 'Create reporitory'

* Stripe
    - Sign up/Sign in.
    - API keys (Click 'Developers' > API keys)
        > Copy 'Secret key'
    - Documentation (Click 'Help icon' > '... More' > Developer Docs)
        + Server-Side SDKs (Click 'Get started with Stripe' > 'Developer resources' > ESSENTIALS | SDKs | Server-side SDKs)
    - Test card numbers (URL: https://docs.stripe.com/testing)
    - Payments (Dashboard > Transactions > Transactions | Payments)
    - Webhooks 
        + Test with a local listener (Click 'Developers' > 'Webhooks' > 'Test with a local listener') [Verificar pago con Stripe CLI]
            * Install Stripe CLI and log in
                $ npm i -g @stripe/cli
            * Forward events to your destination
                $ stripe listen --forward-to localhost:4242/payments/webhooks
            * Trigger events with the CLI
                $ stripe trigger payment_intent.succeeded
        + Add destination (Click 'Developers' > 'Webhooks' > 'Add destination')
            * Create an event destination
                - Configure your event destination
                    > Your account
                    > Events: charge.succeeded
                    Click 'Continue'
                - Choose where you want to send events
                    > Webhook endpoint
                    Click 'Continue'
                - Configure Destination
                    > Destaination name: {{GENERATE}} // inspiring-rhythm
                    > Endpoint URL: {{HOOKDECK_RESQUEST_TO_URL}}
                    > Description: 
                      Stripe to Localhost
                      /payments/webhook
                    Click 'Create destination'
                - Within the 'Event destinations'
                    > Copy 'Signing secret' and replace it in the .env
                    > Click 'Send test event'
                - COPY 'Signing secret'

    - Hookdeck (Event Gateway - Puerta de enlace de eventos)
        + Sign in/Sign out
        + First config
             > Organization name: Ax2CDev
             > Select the product you'd like to use: Event Gateway
             Click 'Create Project'
        + Create your fisrt Hookdeck connection
            * Crear fisrt connection (Click 'Connections' > 'Create first connection')
                > Source Type: Stripe
                > Source Name: stripe-to-localhost
                Click 'Next'
            * Trigger HTTP requests to your Hookdeck source URL
                > Test using mock request
                Click 'Send mock request'
            * Inspect inbound HTTP requests
                Click 'Next'
            * Define your event destination
                > CLI
                > Destination Name: to-localhost
                > CLI Path: /payments/webhook
                Click 'Next'
            * Define your connection rules
                Click 'Next'
            * Install the Hookdeck CLI
                Click 'Next'
            * Authenticate the CLI
                $ hookdeck login --cli-key {{KEY}}
            * Connect CLI to your local server
                $ hookdeck listen 3003 stripe-to-localhost --path /webhooks
                    > Copy URL (stripe-to-localhost > Request to -> URL)
