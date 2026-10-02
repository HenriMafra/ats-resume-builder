# 📄 ATS Resume Builder — Gerador de Currículo Otimizado para ATS com Exportação A4

Gerador de currículos profissionais com **analisador de pontuação de compatibilidade com sistemas ATS (Applicant Tracking Systems)**, análise de densidade de palavras-chave e renderização CSS de alta precisão para impressão A4 e exportação em PDF.

---

## 📌 Que Problema Resolve?

Mais de 75% dos currículos enviados para grandes empresas são descartados automaticamente por robôs de triagem (ATS) antes de qualquer recrutador humano lê-los. Os motivos mais comuns incluem:
- Formatação em colunas duplas complexas que quebram parsers de texto.
- Ausência de palavras-chave semânticas relevantes para a vaga.
- Seções despadronizadas ou fontes não reconhecidas.

O **ATS Resume Builder** resolve esse problema garantindo uma estrutura de HTML/CSS semântica que é 100% interpretável por parsers automatizados e calcula uma nota de aderência em tempo real.

---

## ⚙️ Diferencial Técnico

1. **Scoring de Aderência ATS (0-100):** Analisa presença de verbos de ação, métricas quantificáveis de resultado (ex: %, R$), seções obrigatórias e densidade de competências técnicas.
2. **Layout para Impressão CSS A4:** Regras de `@media print` milimetricamente calibradas para gerar PDFs sem cortes estranhos de linhas ou quebra de blocos.
3. **Privacidade First:** Armazenamento local e seguro, sem compartilhamento de dados pessoais.

---

## 🏗️ Stack Tecnológica

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend Edge:** Cloudflare Pages Functions.
- **Storage:** Cloudflare D1 (SQLite).

---

## 🚀 Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/HenriMafra/ats-resume-builder.git
cd ats-resume-builder

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run dev
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Desenvolvido por **Henri Mafra**.
