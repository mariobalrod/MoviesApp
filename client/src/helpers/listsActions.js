const axios = require('axios');

const createList = async function(name, description, user_id) {
    const response = await axios({
        method: 'POST',
        url: '/api/lists/create',
        data: {name, description, user_id}
    })
    // Messages
    const data = response.data;
    return data;
}

const deleteList = async function(id) {
    await axios({
        method: 'DELETE',
        url: `/api/lists/${id}`
    })
    window.location.reload(true);
}

const getLists = async function(user) {
    const lists = await axios.get(`api/lists/own/${user}`)
    console.log('getLists', lists.data)
    return lists.data;
}

const getCountList = async function(user) {
    const count = await axios.get(`/api/lists/count/${user}`)
    const data = count.data;
    return data;
}

const updateList = async function(name, description, user_id, id) {
    await axios({
        method: 'POST',
        url: `api/lists/${id}`,
        data: { name, description, user_id }
    });
}

const getCredentials = async function(user) {
    const list = await axios.get(`api/lists/${user}`)
    const name = list.data.name;
    const description = list.data.description;
    return {name, description};
}

module.exports = {
    getLists,
    createList,
    deleteList,
    getCountList,
    updateList,
    getCredentials
}