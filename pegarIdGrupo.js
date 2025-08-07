client.on('ready', async () => {
    const chats = await client.getChats();

    const grupos = chats.filter(chat => chat.isGroup);

    grupos.forEach(group => {
        console.log(`Nome: ${group.name} | ID: ${group.id._serialized}`);
    });
});


// const groupName = "Nome do Grupo";

// client.on('ready', async () => {
//     const chat = (await client.getChats()).find(c => c.isGroup && c.name === groupName);

//     if (chat) {
//         console.log(`ID do grupo "${groupName}": ${chat.id._serialized}`);
//     } else {
//         console.log(`Grupo "${groupName}" não encontrado.`);
//     }
// });
