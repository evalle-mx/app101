// Plugin to add fields to any schema (this case a maker name)

module.exports = function addTimeStamp(schema) {
    //Add the new field to the schema
    schema.add({
        sellingDate: Date,
        sold:true
    })
}