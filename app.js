//fshint esversion: 6

const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const mailchimp = require("@mailchimp/mailchimp_marketing")



app.use(bodyParser.urlencoded({extended:true}))
const port = 3000

app.use(express.static("public"))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")       
})

mailchimp.setConfig({
    apiKey: "a4e76c65ff860bfd3b516f8308ac859a-us13",
    server: "us13"
})

app.post("/", function (req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email   
    const listId = "00c42ec2cf"
    const subcribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    async function run(){
        const response = await mailchimp.lists.addListMember(listId,{
            email_address: subcribingUser.email,
            status: "subscribed",
            merge_fields: { 
                FNAME: subcribingUser.firstName,
                LNAME: subcribingUser.lastName
            }
        })
        res.sendFile(__dirname +"/success.html")
        console.log(`Successfully added contact to ${response.id}`)
    }
    run().catch(err => res.sendFile(__dirname +"/failure.html"))
})

// a4e76c65ff860bfd3b516f8308ac859a-us13
// 00c42ec2cf
app.listen(port, function () {
    console.log("Server is running at port" + port)
})