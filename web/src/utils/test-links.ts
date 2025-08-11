import { getLinksList, searchLinks, getLinksSortedByAccess, getLinksStats } from './ListLink';

// Teste da função principal
console.log('=== TESTE DA FUNÇÃO getLinksList ===');

// Gerar 3 links
const threeLinks = getLinksList(3);
console.log('3 links:', threeLinks);

// Gerar 10 links
const tenLinks = getLinksList(10);
console.log('10 links:', tenLinks);

// Teste da busca
console.log('\n=== TESTE DA FUNÇÃO searchLinks ===');
const searchResults = searchLinks('portfolio');
console.log('Resultados da busca por "portfolio":', searchResults);

// Teste da ordenação
console.log('\n=== TESTE DA FUNÇÃO getLinksSortedByAccess ===');
const sortedLinks = getLinksSortedByAccess();
console.log('Links ordenados por acesso:', sortedLinks);

// Teste das estatísticas
console.log('\n=== TESTE DA FUNÇÃO getLinksStats ===');
const stats = getLinksStats();
console.log('Estatísticas:', stats);

// Exemplo de uso em um componente React
console.log('\n=== EXEMPLO DE USO ===');
console.log('Para usar em um componente React:');
console.log('const [links, setLinks] = useState<ListLinkProps[]>([]);');
console.log('useEffect(() => {');
console.log('  const data = getLinksList(20); // 20 links');
console.log('  setLinks(data);');
console.log('}, []);');
