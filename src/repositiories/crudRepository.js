export default function crudRepository(model) {
    return {
        create: async function (data) {
            const newDoc = await model.create(data);
            return newDoc;
        },
        getAll: async function (filter ,projection, config) {
            const allDoc = await model.find(filter, projection, config);
            // filter --> helps to filter on data, that we want to find
            // projextion -> it tells what to show from the foound data,{}empty shows that all data have to be shown
            // config --> pagination format , it conatain offset , skip
            return allDoc;
        },
        getOne: async function(filter, projection, config) {
            const response = await model.findOne(filter, projection, config);
            return response;
        },
        getById: async function (id) {
            const doc = await model.findById(id);
            return doc;
        },
        update: async function (id, data) {
            const response = await model.findByIdAndUpdate(id, data, {
                new:true,runValidators:true
            });
            return response;
        },
        delete: async function (id) {
            const response = await model.findByIdAndDelete(id);
            return response;
        }
    };

}