#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "================================================================"
echo "        FortiGate Inventory System - Inicializador"
echo "================================================================"
echo -e "${NC}"

# Verificar se Node.js está instalado
print_status "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado. Por favor, instale o Node.js primeiro."
    echo "Visite: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js encontrado: $NODE_VERSION"

# Verificar se npm está instalado
print_status "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm encontrado: $NPM_VERSION"

# Instalar dependências
print_status "Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    print_error "Erro ao instalar dependências"
    exit 1
fi
print_success "Dependências instaladas com sucesso"

# Criar arquivo fortigate.conf se não existir
if [ ! -f "fortigate.conf" ]; then
    print_warning "Arquivo fortigate.conf não encontrado. Criando arquivo padrão..."
    cat > fortigate.conf << EOF
FORTIGATE_IP=172.31.254.1
FORTIGATE_TOKEN=SEU_TOKEN
RETENTION_HOURS=2
EOF
    print_success "Arquivo fortigate.conf criado"
    print_warning "IMPORTANTE: Edite o arquivo fortigate.conf com as configurações corretas do seu FortiGate"
else
    print_success "Arquivo fortigate.conf já existe"
fi

# Verificar se pasta server existe
if [ ! -d "server" ]; then
    print_error "Pasta server não encontrada!"
    exit 1
fi

# Criar banco de dados SQLite se não existir
print_status "Inicializando banco de dados SQLite..."
if [ ! -f "inventory.db" ]; then
    print_status "Criando arquivo do banco de dados..."
    touch inventory.db
    print_success "Arquivo inventory.db criado"
else
    print_success "Banco de dados inventory.db já existe"
fi

# Obter IP local
LOCAL_IP=$(hostname -I | awk '{print $1}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

print_status "Iniciando backend (Express) na porta 3001..."

# Iniciar backend em background
cd server
node api.js &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend iniciar
sleep 3

# Verificar se o backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Erro ao iniciar o backend"
    exit 1
fi

print_success "Backend iniciado com sucesso (PID: $BACKEND_PID)"

# Iniciar frontend
print_status "Iniciando frontend (Vite) na porta 5173..."

# Iniciar frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

# Aguardar um pouco para o frontend iniciar
sleep 5

# Verificar se o frontend está rodando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Erro ao iniciar o frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

print_success "Frontend iniciado com sucesso (PID: $FRONTEND_PID)"

echo -e "${GREEN}"
echo "================================================================"
echo "                    SISTEMA INICIADO COM SUCESSO"
echo "================================================================"
echo -e "${NC}"
echo ""
echo -e "${BLUE}📡 Backend API:${NC} http://localhost:3001"
echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}🌐 Acesso em rede:${NC} http://$LOCAL_IP:5173"
echo -e "${BLUE}🗄️  Banco de dados:${NC} SQLite (inventory.db)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "• Edite o arquivo fortigate.conf com as configurações do seu FortiGate"
echo "• O sistema funciona com dados mock se o FortiGate não estiver disponível"
echo "• Whitelist é armazenada no banco SQLite local"
echo "• Use Ctrl+C para parar o sistema"
echo ""
echo -e "${GREEN}✅ Sistema pronto para uso!${NC}"

# Função para cleanup ao receber SIGINT (Ctrl+C)
cleanup() {
    echo ""
    print_status "Parando sistema..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "Sistema parado com sucesso"
    exit 0
}

# Registrar função de cleanup
trap cleanup SIGINT

# Manter o script rodando
while true; do
    # Verificar se os processos ainda estão rodando
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend parou inesperadamente"
        kill $FRONTEND_PID 2>/dev/null
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend parou inesperadamente"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    sleep 5
done