import { ConnectionDB, closeConnection } from './database/connection.js';
import { logError } from './utils/logger.js';
import { createInitialData, triggerErrors, editClientByEmail, searchProductsByName, searchCustomerByEmail, deleteClientByEmail,editProductByName, deleteProductByName} from './utils/createCollection.js';

async function main() {
    try {
        await ConnectionDB();
        console.log('Conectado ao banco!');

        //Funções para testar a criação
        await createInitialData();
        //Funções para disparar erros
        await triggerErrors();
        //Função para editar dados do cliente
        await editClientByEmail({
            nome: 'João da Silva',
            endereco: {
                rua: 'Rua Nova',
                numero: '456',
                cidade: 'Campinas',
                estado: 'SP',
                cep: '13000-000'
            }
        })
        //Função para buscar produto
        await searchProductsByName('Notebook')
        await searchCustomerByEmail('maria.oliveira@example.com')
        await deleteClientByEmail('maria.oliveira@example.com')
        await editProductByName('Monitor xaing', { descricao: 'Monitor 8K UHD atualizado', estoque: 80 });
        await deleteProductByName('Monitor xaing');

    } catch (error) {
        logError(error);
        console.error('Erro:', error.message);
    } finally {
        await closeConnection();
        console.log('Conexão fechada!');
    }
}

main();
