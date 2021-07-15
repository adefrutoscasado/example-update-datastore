const { Client } = require('ckan-client')

const apiKey = '4ed9c0cc-60c1-4c12-8bb7-fedeb0aba422' // get it from "/user/{your-admin-username}/api-tokens"
const apiUrl = 'http://localhost:5000'
const organizationId = 'organization'
const datasetId = 'dataset'

const client = new Client(apiKey, organizationId, datasetId, apiUrl)

const main = async () => {
    // create_package

    let package
    try {
        package = await client.create({
            name: 'package', // should be lowercase without symbols
            owner_org: 'organization' // should be lowercase without symbols
        })
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
    }

    // create_dataset

    let actionName = 'resource_create'
    let payload = {
        package_id: package.id,
        name: 'resource',
        url: 'url',
    }
    
    let resource
    try {
        resource = await client.action(actionName, payload)
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
    }

    // create datastore

    const fields = [
        {
            "id": "x",
            "type": "float",
        },
        {
            "id": "y",
            "type": "float",
        },
    ]

    records = []

    for (let i = 0; i < 10; i++) {        
        records.push({
            "y": i,
            "x": Math.random(),
        })
    }

    actionName = 'datastore_create'
    payload = {
        package_id: package.id,
        resource_id: resource.result.id,
        force: 'true',
        fields,
        records,
        primary_key: 'y'
    }
    try {
        await client.action(actionName, payload)
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
    }

    // upsert datastore

    records = []

    for (let i = 0; i < 20; i++) {        
        records.push({
            "y": i,
            "x": Math.random(),
        })
    }

    actionName = 'datastore_upsert'
    payload = {
        resource_id: resource.result.id,
        force: 'true',
        records,
        method: 'upsert' // can be 'insert' 
    }
    try {
        await client.action(actionName, payload)
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
    }
}

main()
