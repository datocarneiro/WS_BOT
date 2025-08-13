require('dotenv').config();

const API_KEY = process.env.API_KEY;

async function getPedido(numeroOrigem) {
	console.log('Entrou em getPedido');
	try {
		const response = await fetch('https://amplo.eship.com.br/v3/?api=&funcao=webServiceGetOrdem', {
			method: 'POST',
			headers: {
				'Api': API_KEY,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				numeroOrigem,
				armazem: 4
			})
		});

		if (!response.ok) {
			console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
			return { erro: `Erro na consulta: ${response.status}` };
		}

		const result = await response.json();

		// Objeto principal do pedido
		const pedido = result?.corpo?.body?.dados?.[0] || null;

		if (!pedido) {
			console.warn('Nenhuma ordem encontrada para este número de origem.');
			return { erro: 'Ordem não encontrada.' };
		}

		// Pega o id da ordem para consultar os volumes detalhados
		const ordem = pedido.id || null;

		if (!ordem) {
			console.warn('Nenhuma ordem id encontrada.');
			return { erro: 'Ordem não encontrada.' };
		}

		// Consulta detalhes dos volumes baseado no id da ordem
		const volumesDetalhes = await dadosFaturamento(ordem);

		// Retorna os dados principais do pedido junto com volumes detalhados
		return {
			transportes: pedido.transportes || [],
			destinatario: pedido.destinatario || {},
			status: pedido.status || {},
			volumes: volumesDetalhes
		};

	} catch (error) {
		console.error('Erro ao buscar pedido:', error.message);
		return { erro: 'Número inválido ou erro na requisição.' };
	}
}

async function dadosFaturamento(ordem) {
	console.log('Entrou em dadosFaturamento');
	try {
		const response = await fetch('https://amplo.eship.com.br/v3/?api=&funcao=webServiceGetDadosVolumesFaturamento', {
			method: 'POST',
			headers: {
				'Api': API_KEY,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				ordem,
				armazem: 4
			})
		});

		if (!response.ok) {
			console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
			return { erro: `Erro na consulta de dados de faturamento: ${response.status}` };
		}

		const result = await response.json();

		// Corrigido: pegando o array de volumes dentro do primeiro dado do array dados
		const volumes = result?.corpo?.body?.dados?.[0]?.dados || [];

		if (volumes.length === 0) {
			console.warn('Nenhum volume encontrado para esta ordem.');
			return [];
		}

		const listaVolumes = [];

		for (const v of volumes) {
			const codigoVolume = v?.codigoVolume || null;
			if (!codigoVolume) continue;

			console.log(`Consultando dados do volume: ${codigoVolume}`);

			const volumeExtra = await dadosVolume(codigoVolume);

			const STATUS_VOLUMES = {
			1: 'Gerado',
			2: 'Fechado',
			3: 'Embarcado',
			4: 'Despachado',
			5: 'Devolvido',
			6: 'Registrado',
			7: 'Cancelado',
			8: 'Checado'
			};


			listaVolumes.push({
			codigoVolume,
			pesoVolumeFormatado: v?.pesoVolumeFormatado || null,
			larguraVolumeFormatado: v?.larguraVolumeFormatado || null,
			comprimentoVolumeFormatado: v?.comprimentoVolumeFormatado || null,
			alturaVolumeFormatado: v?.alturaVolumeFormatado || null,
			idStatus: volumeExtra?.corpo?.body?.dados?.[0]?.idStatus || null,
			statusTexto: STATUS_VOLUMES[volumeExtra?.corpo?.body?.dados?.[0]?.idStatus] || 'Status desconhecido',
			rastreamento: {
				id: volumeExtra?.corpo?.body?.dados?.[0]?.rastreamento?.id || null,
				codigo: volumeExtra?.corpo?.body?.dados?.[0]?.rastreamento?.codigo || null
			}
			});

		}

		console.log("Lista final de volumes:", listaVolumes);
		return listaVolumes;

	} catch (error) {
		console.error("Erro ao consultar dados de faturamento:", error);
		return { erro: error.message };
	}
}

async function dadosVolume(codigoVolumeRemessa) {
	try {
		const response = await fetch('https://amplo.eship.com.br/v3/?api&funcao=webServiceGetVolume', {
			method: 'POST',
			headers: {
				'Api': API_KEY,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ codigoVolumeRemessa })
		});

		if (!response.ok) {
			console.error(`Erro HTTP ao consultar volume: ${response.status} - ${response.statusText}`);
			return { erro: `Erro na consulta de volume ${codigoVolumeRemessa}` };
		}

		return await response.json();

	} catch (error) {
		console.error(`Erro na função dadosVolume (${codigoVolumeRemessa}):`, error);
		return { erro: error.message };
	}
}

module.exports = getPedido;
