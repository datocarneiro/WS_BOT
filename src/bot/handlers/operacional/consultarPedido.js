// consultarPedido.js
const getPedido = require('../../utils/getPedido');

async function consultarPedido(pedido, client, contact, NAVIGATION_TEXT) {
    await client.sendMessage(contact, `🔎 Consultando pedido ${pedido}! Aguarde enquanto processamos sua solicitação...`);

    try {
        const dados = await getPedido(pedido);

        if (!dados || Object.keys(dados).length === 0) {
            await client.sendMessage(contact, `⚠️ Pedido ${pedido} não encontrado.`);
            return;
        }

        if (dados.erro) {
            await client.sendMessage(contact, `⚠️ Erro: ${dados.erro}, informe novamente`);
            return;
        }

        // Dados do pedido
        const nomeTransporte = dados.transportes?.[0]?.nome || 'Não informado';
        const nomeDest = dados.destinatario?.nome || 'Não informado';
        const razaoSocial = dados.destinatario?.razaoSocial || 'Não informado';
        const statusDesc = dados.status?.descricao || 'Não informado';

        const totalVolumes = dados.volumes?.length || 0;

        let mensagem =
            `📦 *Detalhes do Pedido ${pedido}*:\n\n` +
            `\t*Transporte:* ${nomeTransporte}\n` +
            `\t*Destinatário:* ${nomeDest}\n` +
            `\t*Razão Social:* ${razaoSocial}\n` +
            `\t*Status:* ${statusDesc}\n` +
            `\t*Quantidade total de volumes:* ${totalVolumes}\n`;

        // Lista de volumes
        if (totalVolumes > 0) {
            dados.volumes.forEach((v, i) => {
                mensagem += `\n\t- Volume ${i + 1} (${v.codigoVolume}):\n` +
                    `\t\Peso: ${v.pesoVolumeFormatado}\n` +
                    `\t\Dimensões (LxCxA): ${v.larguraVolumeFormatado} x ${v.comprimentoVolumeFormatado} x ${v.alturaVolumeFormatado}\n` +
                    `\t\Status: ${v.statusTexto}\n` +
                    `\t\Rastreamento: ${v.rastreamento.codigo || 'Não disponível'}`;
            });
        } else {
            mensagem += `\t_Dados de volumes ainda não gerados._`;
        }

        await client.sendMessage(contact, mensagem);

    } catch (err) {
        console.error('Erro ao consultar API:', err);
        await client.sendMessage(contact, '❌ Erro ao consultar o pedido. Tente novamente mais tarde.');
    }

    await client.sendMessage(contact, NAVIGATION_TEXT);
}

module.exports = { consultarPedido };
