// Gera o site estático em dist/. Sem dependências: basta `node build.mjs`.
// Para alterar textos ou contactos, edite este ficheiro.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const SITE = "https://martaferreiraextensions.pt";
const INSTAGRAM = "https://www.instagram.com/marta_ferreira_extensions/";
const INSTAGRAM_USER = "@marta_ferreira_extensions";
const FACEBOOK = "https://www.facebook.com/cabelodeluxoextensions";
const PHONE = "+351 925 110 165";
const PHONE_E164 = "+351925110165";
const WHATSAPP = `https://wa.me/351925110165?text=${encodeURIComponent("Olá Marta, gostaria de marcar uma avaliação.")}`;
const EMAIL = "contato@cabelodeluxo.pt";
const ADDRESS = "Rua Gonçalves Zarco 1D, Monte Belo, Setúbal";
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const VIDEO = "https://www.youtube.com/watch?v=SBxBwAJvCgg";

const sizes = JSON.parse(readFileSync(new URL("./src/images.json", import.meta.url)));

const img = (name, alt, attrs = 'loading="lazy"') => {
  const [w, h] = sizes[name];
  return `<img src="/img/${name}.webp" width="${w}" height="${h}" alt="${alt}" ${attrs}>`;
};

const IG_ICON = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none"/></svg>`;
const WA_ICON = `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const ext = 'target="_blank" rel="noopener"';

const NAV = [
  ["/galeria/", "Antes e depois"],
  ["/imprensa/", "Imprensa"],
  ["/certificados/", "Certificados"],
  ["/faq/", "Perguntas frequentes"],
  ["/marcacoes/", "Marcações"],
];

const contactButtons = () => `<div class="cta">
  <a class="btn solid" href="${WHATSAPP}" ${ext}>${WA_ICON}<span><b>WhatsApp</b><small>${PHONE}</small></span></a>
  <a class="btn" href="${INSTAGRAM}" ${ext}>${IG_ICON}<span><b>Instagram</b><small>${INSTAGRAM_USER}</small></span></a>
</div>`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Marta Ferreira Extensions",
  url: `${SITE}/`,
  image: `${SITE}/img/og.jpg`,
  telephone: PHONE_E164,
  email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: "Rua Gonçalves Zarco 1D", addressLocality: "Setúbal", addressCountry: "PT" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [INSTAGRAM, FACEBOOK],
};

const layout = ({ path, title, description, body }) => {
  const navLinks = NAV.map(([href, label]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE}${path}">
<meta name="theme-color" content="#f7f4ee">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_PT">
<meta property="og:site_name" content="Marta Ferreira Extensions">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}/img/og.jpg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/cormorant-garamond-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
${path === "/" ? `<script type="application/ld+json">${JSON.stringify(JSON_LD)}</script>` : ""}
</head>
<body>
<a class="skip" href="#conteudo">Saltar para o conteúdo</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="/" aria-label="Marta Ferreira Extensions, página inicial"><b>Marta Ferreira</b><small>Extensions</small></a>
    <nav class="nav" aria-label="Principal">${navLinks}</nav>
    <div class="head-contact">
      <a href="${INSTAGRAM}" ${ext}>${IG_ICON}Instagram</a>
      <a class="solid" href="${WHATSAPP}" ${ext}>${WA_ICON}WhatsApp</a>
    </div>
    <details class="menu"><summary>Menu</summary><nav aria-label="Principal, telemóvel">${navLinks}</nav></details>
  </div>
</header>
<main id="conteudo">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="foot">
      <div>
        <a class="brand" href="/"><b>Marta Ferreira</b><small>Extensions</small></a>
        <p class="muted" style="margin-top:18px;color:var(--on-dark-soft)">Em Portugal ou no Brasil, marque uma visita para nos conhecer, esclarecer dúvidas e tomar um café connosco.</p>
      </div>
      <div>
        <h2>Serviços</h2>
        <ul><li>Aplicação</li><li>Remoção</li><li>Manutenção</li><li>Harmonização</li></ul>
      </div>
      <div>
        <h2>O site</h2>
        <ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}<li><a href="/celebridades/">Clientes de referência</a></li></ul>
      </div>
      <div>
        <h2>Contacto</h2>
        <ul>
          <li><a href="${WHATSAPP}" ${ext}>WhatsApp ${PHONE}</a></li>
          <li><a href="${INSTAGRAM}" ${ext}>Instagram</a></li>
          <li><a href="${FACEBOOK}" ${ext}>Facebook</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li><a href="${MAPS}" ${ext}>Setúbal (PT)</a> e São Paulo (BR)</li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <span>© ${new Date().getFullYear()} Marta Ferreira Extensions. Todos os direitos reservados.</span>
      <span>Este site não usa cookies.</span>
      <a href="https://www.livroreclamacoes.pt/" ${ext}>Livro de Reclamações</a>
    </div>
  </div>
</footer>
<div class="contact-bar">
  <a href="${WHATSAPP}" ${ext}>${WA_ICON}WhatsApp</a>
  <a href="${INSTAGRAM}" ${ext}>${IG_ICON}Instagram</a>
</div>
</body>
</html>
`;
};

const pageHead = (eyebrow, title, lead = "") => `<section class="wrap page-head">
  <span class="eyebrow">${eyebrow}</span>
  <h1>${title}</h1>
  ${lead ? `<p class="lead">${lead}</p>` : ""}
</section>`;

const closing = () => `<section class="section dark">
  <div class="wrap split center">
    <div>
      <span class="eyebrow">Venha conhecer</span>
      <h2>Atendimento individual, com hora marcada</h2>
    </div>
    <div>
      <p class="lead">A avaliação não tem compromisso. Fale diretamente com a Marta.</p>
      ${contactButtons()}
    </div>
  </div>
</section>`;

const REVIEWS = [
  ["Márcia Spézia", "10 anos de amizade e mega hair com você!"],
  ["Débora Loiola", "É o mega mais bem colocado que já usei! Além do cuidado que ela tem na colocação!"],
  ["Evellyn Nami", "Super recomendo, excelente profissional e muito atenciosa, meu cabelo ficou maravilhoso."],
  ["Agatha O. dos Santos", "Super recomendo! Uma excelente profissional."],
  ["Priscila Belvedere", "Maravilhosos, já quero outro."],
];

const home = {
  path: "/",
  title: "Marta Ferreira Extensions | Extensões de cabelo em Setúbal",
  description: "Extensões de micro-queratina com cabelo brasileiro. Atendimento individual e com hora marcada, em Setúbal, por Marta Ferreira, com mais de 16 anos de experiência.",
  body: `<section class="wrap hero">
  <div>
    <span class="eyebrow">Extensões de micro-queratina</span>
    <h1>Marta Ferreira</h1>
    <p class="lead">Mais de 16 anos a tornar as clientes mais felizes, seguras e bonitas, em Londres, em São Paulo e agora em Portugal. Atendimento individual, com hora marcada.</p>
    ${contactButtons()}
  </div>
  <figure>${img("hero", "Cabelo longo e encaracolado, visto de costas, com extensões aplicadas por Marta Ferreira", 'fetchpriority="high"')}</figure>
</section>

<section class="wrap">
  <div class="facts">
    <div><b>16+</b><span>anos de experiência</span></div>
    <div><b>1500+</b><span>clientes atendidas</span></div>
    <div><b>3</b><span>países: Reino Unido, Brasil e Portugal, com especialização em Los Angeles</span></div>
  </div>
</section>

<section class="section wrap">
  <div class="split">
    <div>
      <span class="eyebrow">O resultado</span>
      <h2>O visual que sempre sonhou</h2>
    </div>
    <div>
      <p class="lead">Cabelo mais longo e com mais volume.</p>
      <p>Com um ligeiro preenchimento, usando as nossas madeixas de cabelo brasileiro, delicadamente preparadas com micro-cápsulas de queratina, vai notar uma grande mudança.</p>
      <a class="textlink" href="${VIDEO}" ${ext}>Ver a reportagem na televisão</a>
    </div>
  </div>
  <div class="trio">
    <figure>${img("naturalidade", "Cliente de cabelo louro, comprido e liso")}
      <figcaption><h3>Naturalidade</h3><p>As micro-queratinas garantem um visual natural, delicado e cheio de movimento. As extensões tornam-se impercetíveis.</p></figcaption></figure>
    <figure>${img("volume", "Cliente de cabelo louro com ondas largas")}
      <figcaption><h3>Volume</h3><p>Seja o cabelo liso, ondulado ou encaracolado.</p></figcaption></figure>
    <figure>${img("comprimento", "Cabelo louro muito comprido, visto de costas, solto e aberto em leque")}
      <figcaption><h3>Comprimento</h3><p>Escolha o comprimento que deseja para o seu cabelo.</p></figcaption></figure>
  </div>
</section>

<section class="section tint">
  <div class="wrap split">
    <div class="compare">
      <figure>${img("juncao-visivel", "Extensões com as junções bem visíveis junto à raiz")}<figcaption>Junções visíveis</figcaption></figure>
      <figure>${img("juncao-invisivel", "Cabelo natural, sem junções visíveis junto à raiz")}<figcaption>Junções impercetíveis</figcaption></figure>
    </div>
    <div>
      <span class="eyebrow">Veja a diferença</span>
      <h2>Antes e depois</h2>
      <p class="lead" style="margin-top:1.5rem">Ver o resultado noutras pessoas ajuda sempre a imaginar as possibilidades e dá segurança. Um enorme agradecimento às clientes que autorizaram a publicação das suas fotografias.</p>
      <a class="textlink" href="/galeria/">Ver a galeria</a>
      <div class="notes">
        <div><h3>Marque presença</h3><p>Destaque-se e deixe uma impressão inesquecível, onde quer que vá.</p></div>
        <div><h3>Viva momentos especiais</h3><p>Um novo visual traz sempre uma nova forma de se ver e de ser vista. Desfrute.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="split center">
    <figure class="portrait" style="margin:0">${img("marta", "Marta Ferreira no seu espaço, junto a madeixas de cabelo natural")}</figure>
    <div>
      <span class="eyebrow">A especialista</span>
      <h2>Formação e experiência internacionais</h2>
      <p class="lead" style="margin-top:1.5rem">A autoconfiança de uma mulher está, de alguma forma, sempre ligada a um cabelo bonito. Ver o brilho nos olhos das clientes é mágico.</p>
      <p>A Marta trabalhou em Londres, em São Paulo e agora em Portugal, e especializou-se em Los Angeles. Hoje dedica-se a cada cliente de forma individual.</p>
      <p style="margin-bottom:0"><a class="textlink" href="/certificados/">Ver os certificados</a></p>
      <ul class="press-line" aria-label="Referências na imprensa">
        <li>Exame</li><li>InfoMoney</li><li>EGO</li><li>Record TV</li>
      </ul>
      <a class="textlink" href="/imprensa/">Ver na imprensa</a>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap">
    <span class="eyebrow">Avaliações das clientes</span>
    <blockquote>
      <p class="quote-lead">“Acho que nem todas as palavras de gentileza e gratidão do nosso vocabulário seriam suficientes para expressar o meu agradecimento a você, Marta.”</p>
      <footer>Mônica Alecrim</footer>
    </blockquote>
    <div class="reviews">
      <blockquote class="review"><p>“Vai além de valores o que você faz. Cheguei no seu espaço destruída e você me recebeu com amor nos olhos e me devolveu minha identidade.”</p><footer>Mônica Alecrim</footer></blockquote>
      ${REVIEWS.map(([n, t]) => `<blockquote class="review"><p>“${t}”</p><footer>${n}</footer></blockquote>`).join("\n      ")}
    </div>
    <p class="muted" style="margin-top:28px;font-size:.875rem">Avaliações públicas deixadas pelas clientes em redes sociais e motores de busca.</p>
  </div>
</section>

<section class="section wrap">
  <div class="split">
    <div>
      <span class="eyebrow">Serviços</span>
      <h2>Do primeiro dia à manutenção</h2>
      <p class="lead" style="margin-top:1.5rem">Cada serviço é feito em atendimento individual, depois de uma avaliação sem compromisso.</p>
      <a class="textlink" href="/faq/">Perguntas frequentes</a>
    </div>
    <ul class="services"><li>Aplicação</li><li>Remoção</li><li>Manutenção</li><li>Harmonização</li></ul>
  </div>
</section>

${closing()}`,
};

const GALLERY = [1, 2, 3, 4, 5, 6, 7];
const galeria = {
  path: "/galeria/",
  title: "Antes e depois | Marta Ferreira Extensions",
  description: "Resultados reais de clientes de Marta Ferreira: fotografias de antes e depois com extensões de micro-queratina.",
  body: `${pageHead("Galeria", "Antes e depois", "Resultados reais. Um enorme agradecimento às clientes que autorizaram a publicação das suas fotografias.")}
<section class="wrap" style="padding-bottom:var(--section)">
  <div class="ba-grid">
    ${GALLERY.map((n) => `<div class="ba">
      <figure>${img(`ad${n}-antes`, `Cliente ${n}, antes da aplicação`)}<figcaption>Antes</figcaption></figure>
      <figure>${img(`ad${n}-depois`, `Cliente ${n}, depois da aplicação`)}<figcaption>Depois</figcaption></figure>
    </div>`).join("\n    ")}
  </div>
</section>
${closing()}`,
};

const PRESS = [
  ["Exame", "10 de novembro de 2015", "Marta Ferreira, hair extension stylist, trouxe para o Brasil um novo conceito de espaço dedicado inteiramente ao mega hair", "imprensa-exame"],
  ["InfoMoney", "12 de dezembro de 2016", "Como transformar um negócio tradicional pequeno em um negócio compatível com a nova economia digital", "imprensa-infomoney"],
  ["O Estado RJ", "11 de outubro de 2015", "Marta Ferreira, hair extension stylist, trouxe para o Brasil um novo conceito de espaço dedicado inteiramente ao mega hair", "imprensa-estado"],
  ["Gazeta da Semana", "", "A hair extension stylist Marta Ferreira dá dicas de como cuidar do mega hair", "imprensa-gazeta"],
  ["EGO", "", "Antes e depois: Dani Bolina muda o visual e coloca megahair", "imprensa-ego"],
  ["Revista", "", "Alongamento com estilo", "imprensa-revista"],
];
const imprensa = {
  path: "/imprensa/",
  title: "Na imprensa | Marta Ferreira Extensions",
  description: "Marta Ferreira na imprensa e na televisão: Exame, InfoMoney, EGO, O Estado RJ, Gazeta da Semana e Record TV.",
  body: `${pageHead("Imprensa", "Marta Ferreira na imprensa")}
<section class="wrap" style="padding-bottom:var(--section)">
  <blockquote style="margin-bottom:clamp(40px,6vw,72px)">
    <p class="quote-lead" style="max-width:30ch">“O cabelo é a moldura do rosto e a essência da beleza feminina.”</p>
    <footer class="muted" style="margin-top:18px;font-size:.875rem">O Estado RJ, 2015</footer>
  </blockquote>
  <ul class="press">
    <li>
      <span class="outlet">Record TV<br><span class="muted" style="letter-spacing:0;text-transform:none;font-weight:400">Televisão</span></span>
      <h2>Marta Ferreira no programa Domingo Espetacular</h2>
      <a class="textlink" href="${VIDEO}" ${ext}>Ver vídeo</a>
    </li>
    ${PRESS.map(([o, d, t, f]) => `<li>
      <span class="outlet">${o}${d ? `<br><span class="muted" style="letter-spacing:0;text-transform:none;font-weight:400">${d}</span>` : ""}</span>
      <h2>${t}</h2>
      <a class="textlink" href="/img/${f}.webp" ${ext}>Ver recorte</a>
    </li>`).join("\n    ")}
  </ul>
</section>
${closing()}`,
};

const CERTS = [
  ["cert-just", "Just Extensions Academy", "Just Extensions, curso “Just About The Heat Training Course”, 2014"],
  ["cert-donna", "Donna Bella Hair", "Donna Bella Hair, certificação em extensões de queratina (fusão)"],
  ["cert-lab", "Hair Laboratories", "Hair Laboratories, certificado de excelência em extensões, 2013"],
];
const certificados = {
  path: "/certificados/",
  title: "Certificados | Marta Ferreira Extensions",
  description: "Formação internacional de Marta Ferreira em extensões de cabelo: cursos na Europa e nos Estados Unidos da América.",
  body: `${pageHead("Marta Ferreira", "Sempre em busca de aperfeiçoamento", "“Esforço-me para levar sempre o melhor às minhas clientes.” Aqui estão alguns dos cursos feitos na Europa e nos Estados Unidos da América.")}
<section class="wrap" style="padding-bottom:var(--section)">
  <div class="certs">
    ${CERTS.map(([f, a, c]) => `<figure>${img(f, `Certificado de ${a} em nome de Marta Ferreira`)}<figcaption>${c}</figcaption></figure>`).join("\n    ")}
  </div>
</section>
<section class="section tint">
  <div class="wrap split center">
    <figure style="margin:0;max-width:380px">${img("marta-retrato", "Marta Ferreira, de cabelo escuro, comprido e encaracolado")}</figure>
    <div>
      <h2>Experiência internacional</h2>
      <p class="lead" style="margin-top:1.5rem">Na profissão e nas especializações.</p>
      <h2 style="margin-top:40px">Sempre a renovar</h2>
      <p class="lead" style="margin-top:1.5rem">A acompanhar os lançamentos e a aperfeiçoar as técnicas que utiliza.</p>
    </div>
  </div>
</section>
${closing()}`,
};

const CLIENTS = [
  ["Thaísa Menezes", "Bicampeã olímpica de voleibol pela seleção brasileira"],
  ["Dani Bolina", "Apresentadora de televisão"],
  ["Luisa Granatto", "Top model"],
  ["Márcia Spézia", "Modelo e capa de revista"],
  ["Thaiz Schmitt", "Modelo e capa de revista"],
  ["Lizi Benites", "Televisão"],
];
const celebridades = {
  path: "/celebridades/",
  title: "Clientes de referência | Marta Ferreira Extensions",
  description: "Algumas das figuras públicas que confiaram o seu cabelo a Marta Ferreira.",
  body: `${pageHead("Clientes de referência", "Algumas figuras públicas", "Que já passaram pelas mãos de Marta Ferreira.")}
<section class="wrap" style="padding-bottom:var(--section)">
  <ul class="names">
    ${CLIENTS.map(([n, d]) => `<li><b>${n}</b><span>${d}</span></li>`).join("\n    ")}
  </ul>
</section>
${closing()}`,
};

const FAQ = [
  ["Quanto tempo demora a aplicação das extensões?", ["O tempo necessário depende muito da quantidade de cabelo, mas normalmente a aplicação demora de uma a três horas."]],
  ["As pessoas vão perceber que uso extensões?", ["Desde que escolha um estilo e uma cor que correspondam ao seu cabelo, as extensões ficam totalmente naturais e ninguém vai perceber."]],
  ["As extensões danificam o meu cabelo?", [
    "Esta é uma pergunta comum. Quando as extensões são aplicadas corretamente, não há razão para danificarem o seu cabelo. Aliás, muitas mulheres usam extensões para deixar crescer o próprio cabelo até ao comprimento desejado. Isto não quer dizer, no entanto, que todos os cabelos sejam adequados para receber extensões.",
    "A segurança do seu cabelo é muito importante para nós e tomamos todas as precauções razoáveis. Verificamos se o seu cabelo é adequado antes de começar, numa consulta gratuita, e oferecemos revisões de cortesia enquanto estiver a usar as extensões aplicadas por nós.",
  ]],
  ["As extensões fazem cair o cabelo?", ["Não. Mas convém ter presente que toda a gente, com ou sem extensões, perde normalmente entre 70 e 100 fios de cabelo por dia, o que dá cerca de 3.000 fios por mês e 36 mil por ano. Não se preocupe: é perfeitamente natural e faz parte do ciclo de renovação do cabelo. Como temos em média 100.000 a 150.000 fios, esta taxa de renovação é normal."]],
  ["Quanto tempo duram as extensões?", ["Aproximadamente 3 meses."]],
  ["Posso nadar, fazer desporto ou ir à praia?", ["O seu novo cabelo fica tão bonito molhado como seco. Com uma aplicação correta, as junções das extensões não aparecem na água. Pode tomar banho, nadar e sair ao vento e à chuva sem preocupações. Em todo o caso, lembre-se de que a praia, o mar e o sol exigem cuidados com o cabelo, com ou sem extensões. As nossas extensões estão tão bem ligadas ao seu cabelo que se tornam impercetíveis, tanto no desporto como num dia de tempestade."]],
  ["Como fica o meu cabelo depois de remover as extensões?", ["Quando a aplicação é feita da forma correta, o seu cabelo permanece intacto e as extensões podem ser removidas sem o danificar. Por isso, certifique-se sempre dos conhecimentos do profissional que escolhe, tendo em conta as suas clientes e certificações. Afinal, é o seu cabelo que está em jogo."]],
  ["Posso usar secador, prancha e modelador?", ["Sim, pode usar todos estes aparelhos, com os mesmos cuidados que tem com o seu próprio cabelo."]],
];
const faq = {
  path: "/faq/",
  title: "Perguntas frequentes | Marta Ferreira Extensions",
  description: "Quanto tempo demora a aplicação, quanto duram e se as extensões danificam o cabelo: respostas às dúvidas mais comuns sobre extensões de cabelo.",
  body: `${pageHead("Perguntas frequentes", "Cabelo e extensões", "Quem nunca usou extensões fica muitas vezes com dúvidas. Veja se a sua está aqui, ou venha tomar um café connosco e falar sobre o assunto.")}
<section class="wrap" style="padding-bottom:var(--section)">
  <div class="faq">
    ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><div>${a.map((p) => `<p>${p}</p>`).join("")}</div></details>`).join("\n    ")}
  </div>
</section>
${closing()}`,
};

const marcacoes = {
  path: "/marcacoes/",
  title: "Marcações | Marta Ferreira Extensions",
  description: `Marque a sua avaliação sem compromisso com Marta Ferreira, em Setúbal. Atendimento individual, todos os dias das 09:00 às 18:00. WhatsApp ${PHONE}.`,
  body: `<section class="wrap" style="padding-block:clamp(48px,8vw,104px) var(--section)">
  <div class="split">
    <div>
      <span class="eyebrow">Marcações</span>
      <h1 style="font-size:clamp(3rem,7vw,5.5rem)">Marque o seu horário</h1>
      <p class="lead" style="margin-block:1.5rem 2rem">Atendimento individual, com hora marcada. Fale diretamente com a Marta.</p>
      ${contactButtons()}
    </div>
    <div class="info">
      <div><h2>Avaliação sem compromisso</h2><p class="muted">Venha conhecer-nos e fazer uma avaliação sem compromisso.</p></div>
      <div><h2>Horário</h2><p class="muted">Todos os dias, das 09:00 às 18:00.</p></div>
      <div><h2>Morada</h2><p class="muted">${ADDRESS}</p><a class="textlink" href="${MAPS}" ${ext}>Abrir no Google Maps</a></div>
      <div><h2>E-mail e telefone</h2><p class="muted"><a href="mailto:${EMAIL}">${EMAIL}</a><br><a href="tel:${PHONE_E164}">${PHONE}</a></p></div>
    </div>
  </div>
</section>`,
};

const notFound = {
  path: "/404.html",
  title: "Página não encontrada | Marta Ferreira Extensions",
  description: "Esta página não existe.",
  body: `${pageHead("Erro 404", "Página não encontrada", "O endereço pode ter mudado. Volte à página inicial ou fale connosco.")}
<section class="wrap" style="padding-bottom:var(--section)">${contactButtons()}<p style="margin-top:32px"><a class="textlink" href="/">Página inicial</a></p></section>`,
};

// Geração
const OUT = new URL("./dist/", import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true });
cpSync(new URL("./public/", import.meta.url).pathname, OUT, { recursive: true });

const pages = [home, galeria, imprensa, certificados, celebridades, faq, marcacoes];
for (const page of [...pages, notFound]) {
  const file = page.path.endsWith(".html") ? `${OUT}${page.path.slice(1)}` : `${OUT}${page.path.slice(1)}index.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout(page));
}
writeFileSync(`${OUT}sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync(`${OUT}favicon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1f1b18"/><text x="32" y="45" font-family="Georgia,serif" font-size="38" text-anchor="middle" fill="#f4efe7">M</text></svg>`);
console.log(`${pages.length + 1} páginas geradas em dist/`);
