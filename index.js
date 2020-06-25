const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// PAGINATION API
const clientData = require('./datasource/client.json');
app.get('/pages', (req, res) => {

    data = clientData;

    // filter by search keywords
    if( req.query.generalSearch ) {
        const match = {};
        match.generalSearch = req.query.generalSearch || '';
        data = data.filter((data) => {
            let matched = false;
            Object.values(data).forEach( value => {
                if(value.toString().includes(match.generalSearch)) matched = true; 
            })
            return matched;
        });
    } 
    if(req.query.sort && req.query.field){
        // sort
        const sort = {};
        sort.orderBy = req.query.sort;
        sort.field = req.query.field;
        data = data.sort(function(a, b) {
            if( sort.orderBy === 'asc' )
                return a[sort.field] > b[sort.field] ? 1 : -1;
            return a[sort.field] < b[sort.field] ? 1: -1;
        });
    }
    if(req.query.page && req.query.perpage && parseInt(req.query.perpage) > 0) {
        // pagination
        requiredPages = req.query.page;
        perpage = req.query.perpage;
        totalPages = Math.ceil(data.length / perpage); // calculate total pages
        page = Math.max(requiredPages, 1);
        page = Math.min(page, totalPages);
        offset = (page - 1) * perpage;
        if( offset < 0 ) offset = 0;
        data = data.slice(offset, perpage);
    }
    res.json(data);
});

app.listen(PORT, ()=>console.log(`Running at port ${PORT}`)); 