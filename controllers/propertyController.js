
const admin = (req, res) =>{
    res.render('properties/admin',{
         pageHeader: "My properties",
         header: true
    })
}

export {
    admin
}