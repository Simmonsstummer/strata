# Strata — key events in Earth's history, with a short deep dive and where to learn more
# Content license: CC BY 4.0, © 2026 Simone Pompei. Ages in millions of years (Ma), rounded.
#
# Each event: id, age, emoji, kind (life, earth, climate, extinction, human), name (it, en), txt (it, en)
#   see  = places where you can see it: (name it, name en, url)
#   read = books: 'Author, Title (year)'  — the Italian edition is given where one exists
#   web  = online resources: (label, url)
#   el   = elements to open in Elementa (https://simmonsstummer.github.io/elementa/)

W = lambda t: f'https://en.wikipedia.org/wiki/{t}'
WI = lambda t: f'https://it.wikipedia.org/wiki/{t}'
EONS = ('PBS Eons (YouTube)', 'https://www.youtube.com/@eons')

E = []
def ev(id, a, e, k, n, txt, see=(), read=(), web=(), el=()):
    E.append(dict(id=id, a=a, e=e, k=k, n=n, txt=txt, see=list(see), read=list(read), web=list(web), el=list(el)))

ev('earth', 4567, '🌍', 'earth', ("Nasce la Terra", "Earth forms"),
   ("Da un disco di gas e polvere attorno al giovane Sole si formano granuli, poi sassi, poi pianeti. L'età si misura nei meteoriti più antichi, che non sono mai stati fusi di nuovo: i loro granuli bianchi hanno 4567 milioni di anni.",
    "Out of a disc of gas and dust around the young Sun grew grains, then pebbles, then planets. The age is measured in the oldest meteorites, which were never melted again: their white grains are 4,567 million years old."),
   see=[("Frammenti del meteorite Allende in molti musei di storia naturale", "Pieces of the Allende meteorite in many natural history museums", W('Allende_meteorite'))],
   read=["Robert M. Hazen, The Story of Earth (2012)"],
   web=[("Wikipedia: History of Earth", W('History_of_Earth')), ("Wikipedia: Formation of the Solar System", W('Formation_and_evolution_of_the_Solar_System'))],
   el=['pb', 'u'])
ev('moon', 4510, '🌕', 'earth', ("Un impatto gigante forma la Luna", "A giant impact forms the Moon"),
   ("Un pianeta grande circa come Marte, chiamato Theia, urta la giovane Terra. I detriti finiti in orbita si riuniscono e formano la Luna. Le rocce lunari portate dalle missioni Apollo sono quasi identiche al mantello terrestre: è uno degli indizi più forti.",
    "A planet about the size of Mars, called Theia, strikes the young Earth. The debris thrown into orbit gathers into the Moon. Moon rocks brought back by the Apollo missions are almost identical to Earth's mantle: one of the strongest clues."),
   read=["Erik Asphaug, When the Earth Had Two Moons (2019)"],
   web=[("Wikipedia: Giant-impact hypothesis", W('Giant-impact_hypothesis'))])
ev('zircon', 4404, '💎', 'earth', ("Il cristallo più antico (zircone di Jack Hills)", "The oldest crystal (Jack Hills zircon)"),
   ("In una roccia sedimentaria delle Jack Hills, in Australia occidentale, ci sono granelli di zircone più vecchi della roccia che li contiene: il più antico ha 4404 milioni di anni. La sua chimica dice che si è formato in presenza di acqua liquida: la Terra aveva già un oceano.",
    "A sedimentary rock in the Jack Hills of Western Australia holds zircon grains older than the rock itself: the oldest is 4,404 million years old. Its chemistry says it formed with liquid water around: Earth already had an ocean."),
   web=[("Wikipedia: Jack Hills", W('Jack_Hills')), ("Wikipedia: Zircon", W('Zircon'))],
   el=['zr', 'u'])
ev('acasta', 4031, '🪨', 'earth', ("La roccia più antica (gneiss di Acasta)", "The oldest rock (Acasta gneiss)"),
   ("Lungo il fiume Acasta, nel nord del Canada, affiorano gneiss nati come rocce granitiche oltre 4 miliardi di anni fa. Dal 2023 la loro età segna l'inizio dell'Archeano.",
    "Along the Acasta River in northern Canada crop out gneisses that formed as granitic rocks over 4 billion years ago. Since 2023 their age marks the start of the Archean."),
   see=[("Un blocco di gneiss di Acasta è esposto al Canadian Museum of Nature (Ottawa)", "A block of Acasta gneiss is on show at the Canadian Museum of Nature (Ottawa)", W('Canadian_Museum_of_Nature'))],
   web=[("Wikipedia: Acasta Gneiss", W('Acasta_Gneiss'))], el=['zr'])
ev('stromatolites', 3480, '🦠', 'life', ("Le prime stromatoliti sicure", "The first certain stromatolites"),
   ("Le stromatoliti sono rocce costruite da tappeti di batteri che intrappolano il sedimento, strato dopo strato. Quelle della Formazione Dresser, nel Pilbara australiano, sono tra le prove più antiche e accettate di vita. Esistono ancora oggi, vive, in poche lagune salate.",
    "Stromatolites are rocks built by mats of bacteria that trap sediment, layer after layer. Those of the Dresser Formation in Australia's Pilbara are among the oldest widely accepted traces of life. Living ones still grow today in a few salty lagoons."),
   see=[("Stromatoliti vive a Hamelin Pool, Shark Bay (Australia)", "Living stromatolites at Hamelin Pool, Shark Bay (Australia)", W('Hamelin_Pool_Marine_Nature_Reserve'))],
   read=["Andrew H. Knoll, Life on a Young Planet (2003)", "J. William Schopf, Cradle of Life (1999)"],
   web=[("Wikipedia: Stromatolite", WI('Stromatolite')), EONS], el=['ca'])
ev('oxygen', 2430, '💨', 'climate', ("Grande Ossidazione: arriva l'ossigeno", "Great Oxidation: oxygen arrives"),
   ("I cianobatteri producevano ossigeno da tempo, ma il ferro dei mari lo consumava. Quando il ferro finisce, l'ossigeno si accumula nell'aria. Nelle rocce lo raccontano le formazioni di ferro a bande e i primi suoli rossi, ossidati.",
    "Cyanobacteria had been making oxygen for a long time, but iron in the seas used it up. When the iron ran out, oxygen built up in the air. Rocks record it in banded iron formations and the first red, oxidised soils."),
   see=[("Le formazioni di ferro a bande del Karijini National Park (Australia)", "The banded iron formations of Karijini National Park (Australia)", W('Karijini_National_Park'))],
   read=["Nick Lane, Oxygen: The Molecule that Made the World (2002)", "Paul G. Falkowski, Life's Engines (2015)"],
   web=[("Wikipedia: Great Oxidation Event", W('Great_Oxidation_Event')), ("Wikipedia: Banded iron formation", W('Banded_iron_formation'))],
   el=['o', 'fe'])
ev('eukaryotes', 1650, '🔬', 'life', ("Primi eucarioti sicuri", "First certain eukaryotes"),
   ("Gli eucarioti sono le cellule con nucleo, come le nostre. I primi fossili sicuri sono piccole sfere con pareti ornate (acritarchi) di circa 1,65 miliardi di anni, in Cina e Australia. Il nucleo e i mitocondri nascono da un'antica alleanza tra cellule.",
    "Eukaryotes are cells with a nucleus, like ours. The first certain fossils are small spheres with ornate walls (acritarchs) about 1.65 billion years old, from China and Australia. The nucleus and mitochondria come from an ancient alliance between cells."),
   read=["Nick Lane, The Vital Question (2015)"],
   web=[("Wikipedia: Eukaryote", W('Eukaryote'))])
ev('rodinia', 1050, '🧩', 'earth', ("Si forma il supercontinente Rodinia", "The supercontinent Rodinia forms"),
   ("Tutti i continenti si saldano in un unico blocco, Rodinia, attraverso l'orogenesi grenvilliana. I continenti si uniscono e si separano in cicli di centinaia di milioni di anni: Rodinia, poi Pangea, e tra circa 250 milioni di anni forse un nuovo supercontinente.",
    "All continents weld into a single block, Rodinia, through the Grenville orogeny. Continents gather and split in cycles hundreds of millions of years long: Rodinia, then Pangaea, and perhaps a new supercontinent in about 250 million years."),
   read=["Ted Nield, Supercontinent (2007)"],
   web=[("Wikipedia: Rodinia", WI('Rodinia')), ("Wikipedia: Supercontinent cycle", W('Supercontinent_cycle'))])
ev('snowball', 717, '❄️', 'climate', ("Terra a palla di neve (glaciazione sturtiana)", "Snowball Earth (Sturtian glaciation)"),
   ("Per milioni di anni il ghiaccio copre i continenti e gli oceani fino all'equatore. Lo dicono i depositi glaciali trovati in rocce che allora erano ai tropici, sigillati da carbonati deposti in mari caldi appena dopo il disgelo.",
    "For millions of years ice covers continents and oceans down to the equator. Glacial deposits found in rocks that were then in the tropics say so, sealed by carbonates laid down in warm seas right after the thaw."),
   see=[("I Flinders Ranges (Australia), con tilliti e il chiodo d'oro dell'Ediacarano", "The Flinders Ranges (Australia), with tillites and the Ediacaran golden spike", W('Flinders_Ranges'))],
   read=["Gabrielle Walker, Snowball Earth (2003)"],
   web=[("Wikipedia: Snowball Earth", WI('Terra_a_palla_di_neve')), ("snowballearth.org", 'https://www.snowballearth.org/')])
ev('ediacara', 570, '🪼', 'life', ("La biota di Ediacara", "The Ediacara biota"),
   ("I primi grandi organismi pluricellulari: dischi, fronde e «materassini» come Dickinsonia, lunghi fino a un metro. Non avevano bocca né zampe e molti non somigliano a nessun animale di oggi. Alcuni erano già animali veri.",
    "The first large multicellular organisms: discs, fronds and «quilts» such as Dickinsonia, up to a metre long. They had no mouth or legs and many look like no living animal. Some were already true animals."),
   see=[("Mistaken Point (Terranova), patrimonio UNESCO", "Mistaken Point (Newfoundland), a UNESCO site", W('Mistaken_Point_Ecological_Reserve')), ("Ediacara Hills (Australia)", "Ediacara Hills (Australia)", W('Ediacara_Hills'))],
   read=["Andrew H. Knoll, Life on a Young Planet (2003)"],
   web=[("Wikipedia: Ediacaran biota", W('Ediacaran_biota')), EONS])
ev('cambrian-explosion', 530, '🦐', 'life', ("Esplosione cambriana", "Cambrian explosion"),
   ("In circa 20 milioni di anni compaiono quasi tutti i grandi gruppi di animali, con occhi, zampe articolate, gusci e scheletri. Nascono i primi predatori e le prime prede corazzate: una corsa agli armamenti.",
    "Within about 20 million years almost all major animal groups appear, with eyes, jointed legs, shells and skeletons. The first predators and the first armoured prey arise: an arms race."),
   read=["Stephen Jay Gould, Wonderful Life (1989) — it.: La vita meravigliosa", "Simon Conway Morris, The Crucible of Creation (1998)"],
   web=[("Wikipedia: Esplosione cambriana", WI('Esplosione_cambriana')), EONS])
ev('trilobites', 521, '🪲', 'life', ("Compaiono i trilobiti", "Trilobites appear"),
   ("Artropodi marini con il corpo diviso in tre lobi e occhi fatti di cristalli di calcite. Vissero per quasi 300 milioni di anni, con oltre 20 000 specie, e scomparvero nella grande estinzione di fine Permiano. In Italia si trovano in Sardegna.",
    "Marine arthropods with a three-lobed body and eyes made of calcite crystals. They lived for almost 300 million years, with over 20,000 species, and vanished in the great end-Permian extinction. In Italy they are found in Sardinia."),
   read=["Richard Fortey, Trilobite! Eyewitness to Evolution (2000)"],
   web=[("Wikipedia: Trilobita", WI('Trilobita'))], el=['ca'])
ev('burgess', 508, '🐚', 'life', ("Gli animali di Burgess Shale", "The Burgess Shale animals"),
   ("Nelle Montagne Rocciose canadesi, Charles Walcott scoprì nel 1909 argilliti che conservano anche le parti molli: Opabinia con cinque occhi, Anomalocaris, Hallucigenia. Sono una finestra unica sull'esplosione cambriana.",
    "In the Canadian Rockies, Charles Walcott found in 1909 shales that even preserve soft parts: five-eyed Opabinia, Anomalocaris, Hallucigenia. They are a unique window on the Cambrian explosion."),
   see=[("Burgess Shale, Parco nazionale di Yoho (escursioni guidate)", "Burgess Shale, Yoho National Park (guided hikes)", W('Burgess_Shale')), ("Royal Ontario Museum (Toronto)", "Royal Ontario Museum (Toronto)", W('Royal_Ontario_Museum'))],
   read=["Stephen Jay Gould, Wonderful Life (1989) — it.: La vita meravigliosa"],
   web=[("ROM: The Burgess Shale", 'https://burgess-shale.rom.on.ca/'), EONS])
ev('landplants', 470, '🌱', 'life', ("Prime piante sulla terraferma", "First land plants"),
   ("Le prime piante terrestri sono simili alle epatiche di oggi: piccole, senza vasi né radici. Le conosciamo dalle loro spore fossili. Cambiano l'erosione delle rocce e, piano piano, anche il clima.",
    "The first land plants resemble today's liverworts: small, without vessels or roots. We know them from their fossil spores. They change how rocks weather and, slowly, the climate too."),
   web=[("Wikipedia: Evolution of plants", W('Evolutionary_history_of_plants'))])
ev('end-ordovician', 445, '💀', 'extinction', ("Estinzione di fine Ordoviciano", "End-Ordovician extinction"),
   ("Una glaciazione breve e intensa, con il Gondwana sul polo sud, abbassa il livello del mare e raffredda gli oceani. Scompare circa l'85% delle specie marine. È la prima delle «cinque grandi» estinzioni.",
    "A short, intense glaciation, with Gondwana over the South Pole, lowers sea level and chills the oceans. About 85% of marine species vanish. It is the first of the «Big Five» extinctions."),
   read=["Peter Brannen, The Ends of the World (2017)"],
   web=[("Wikipedia: Late Ordovician mass extinction", W('Late_Ordovician_mass_extinction'))])
ev('cooksonia', 430, '🌿', 'life', ("Prime piante vascolari (Cooksonia)", "First vascular plants (Cooksonia)"),
   ("Cooksonia era alta pochi centimetri: un fusticino ramificato con le spore in cima. Ma aveva vasi per portare l'acqua, l'invenzione che permetterà alle piante di diventare alberi.",
    "Cooksonia was a few centimetres tall: a little branching stem with spores at the tips. But it had vessels to carry water, the invention that will let plants become trees."),
   web=[("Wikipedia: Cooksonia", W('Cooksonia'))])
ev('forests', 385, '🌳', 'life', ("Le prime foreste", "The first forests"),
   ("Nel Devoniano medio compaiono alberi alti fino a 10 metri, come Archaeopteris. Le loro radici rompono le rocce e creano i primi suoli profondi; le foreste sottraggono CO₂ all'aria e raffreddano il pianeta.",
    "In the Middle Devonian trees up to 10 metres tall appear, such as Archaeopteris. Their roots break rocks and build the first deep soils; forests draw CO₂ out of the air and cool the planet."),
   web=[("Wikipedia: Archaeopteris", W('Archaeopteris'))], el=['c'])
ev('tiktaalik', 375, '🐟', 'life', ("Tiktaalik: i pesci verso la terraferma", "Tiktaalik: fish head for land"),
   ("Un pesce con collo, polmoni e pinne robuste con ossa simili a quelle di un braccio, trovato nel 2004 nell'Artico canadese. Neil Shubin lo cercò proprio in rocce di quell'età, prevedendo che lì ci fosse una forma di passaggio.",
    "A fish with a neck, lungs and sturdy fins with arm-like bones, found in 2004 in the Canadian Arctic. Neil Shubin looked for it precisely in rocks of that age, predicting that a transitional form would be there."),
   read=["Neil Shubin, Your Inner Fish (2008) — it.: Il pesce che è in noi"],
   web=[("Wikipedia: Tiktaalik", W('Tiktaalik')), EONS])
ev('late-devonian', 372, '💀', 'extinction', ("Estinzione del Devoniano superiore", "Late Devonian extinction"),
   ("Una serie di crisi, con i mari poveri di ossigeno, distrugge le grandi scogliere e i pesci corazzati. Nelle rocce si vedono come livelli neri, gli orizzonti Kellwasser.",
    "A series of crises, with oxygen-poor seas, destroys the great reefs and the armoured fishes. In the rocks they show up as black beds, the Kellwasser horizons."),
   read=["Peter Brannen, The Ends of the World (2017)"],
   web=[("Wikipedia: Late Devonian extinction", W('Late_Devonian_extinction'))])
ev('reptiles', 312, '🦎', 'life', ("Primi rettili", "First reptiles"),
   ("Hylonomus, lungo una ventina di centimetri, è stato trovato dentro i tronchi cavi di licopodi fossili a Joggins, in Nuova Scozia. Con l'uovo amniotico i vertebrati non hanno più bisogno dell'acqua per riprodursi.",
    "Hylonomus, about twenty centimetres long, was found inside the hollow trunks of fossil club mosses at Joggins, Nova Scotia. With the amniotic egg, vertebrates no longer need water to breed."),
   see=[("Joggins Fossil Cliffs (Canada), patrimonio UNESCO", "Joggins Fossil Cliffs (Canada), a UNESCO site", W('Joggins_Fossil_Cliffs'))],
   web=[("Wikipedia: Hylonomus", W('Hylonomus'))])
ev('coal', 305, '🪵', 'life', ("Le grandi foreste di carbone", "The great coal forests"),
   ("Paludi immense coperte di licopodi alti 30 metri, equiseti e felci. Il legno sepolto diventa carbone fossile; quando il clima si fa più secco, queste foreste collassano.",
    "Huge swamps covered in 30-metre club mosses, horsetails and ferns. The buried wood becomes coal; when the climate dries, these forests collapse."),
   web=[("Wikipedia: Carboniferous rainforest collapse", W('Carboniferous_rainforest_collapse'))], el=['c'])
ev('pangaea', 300, '🗺️', 'earth', ("Si forma la Pangea", "Pangaea forms"),
   ("Con l'orogenesi varisica tutti i continenti si riuniscono in un solo supercontinente a forma di C. Intorno c'è un unico superoceano, Panthalassa, antenato del Pacifico; nella rientranza a est si apre il golfo della Tetide. L'idea della deriva dei continenti fu di Alfred Wegener (1912), che notò come le coste dell'Africa e del Sud America combaciassero.",
    "With the Variscan orogeny all continents gather into a single C-shaped supercontinent. Around it lies one superocean, Panthalassa, ancestor of the Pacific; in the eastern bay opens the Tethys gulf. The idea of continental drift came from Alfred Wegener (1912), who noticed how the coasts of Africa and South America fit together."),
   read=["Ted Nield, Supercontinent (2007)", "Alfred Wegener, Die Entstehung der Kontinente und Ozeane (1915) — it.: La formazione dei continenti e degli oceani"],
   web=[("Wikipedia: Pangea", WI('Pangea')), ("Wikipedia: Panthalassa", W('Panthalassa'))])
ev('end-permian', 252, '💀', 'extinction', ("La grande estinzione di fine Permiano", "The great end-Permian extinction"),
   ("La peggiore crisi della vita: scompare circa l'80–90% delle specie marine. Le eruzioni dei Trappi Siberiani liberano enormi quantità di CO₂: gli oceani si scaldano, si acidificano e perdono ossigeno. A Meishan, in Cina, si vede lo strato esatto.",
    "Life's worst crisis: about 80–90% of marine species disappear. The Siberian Traps eruptions release huge amounts of CO₂: oceans warm, acidify and lose oxygen. At Meishan, China, you can see the exact bed."),
   see=[("Il passaggio Permiano-Triassico nella gola del Bletterbach (Alto Adige)", "The Permian–Triassic transition in the Bletterbach gorge (South Tyrol)", W('Bletterbach'))],
   read=["Michael J. Benton, When Life Nearly Died (2003)", "Peter Brannen, The Ends of the World (2017)"],
   web=[("Wikipedia: Permian–Triassic extinction event", W('Permian%E2%80%93Triassic_extinction_event')), EONS], el=['c', 's'])
ev('carnian', 233, '🌧️', 'climate', ("Episodio Pluviale Carnico", "Carnian Pluvial Episode"),
   ("Per circa un milione di anni il clima diventa umido e piovoso, forse per le eruzioni di Wrangellia. Le scogliere delle Dolomiti si fermano e si riempiono di argille; dopo, i dinosauri si diffondono ovunque. È stato scoperto studiando proprio le rocce delle Alpi italiane.",
    "For about a million years the climate turns wet and rainy, perhaps because of the Wrangellia eruptions. The Dolomites' reefs stop growing and fill with clay; afterwards, dinosaurs spread everywhere. It was discovered by studying the rocks of the Italian Alps."),
   see=[("Le Dolomiti, patrimonio UNESCO", "The Dolomites, a UNESCO site", W('Dolomites'))],
   web=[("Wikipedia: Carnian pluvial episode", W('Carnian_pluvial_episode'))])
ev('dinosaurs', 231, '🦖', 'life', ("Primi dinosauri", "First dinosaurs"),
   ("I più antichi dinosauri, come Herrerasaurus ed Eoraptor, vengono da Ischigualasto, in Argentina. Erano piccoli o medi e camminavano su due zampe.",
    "The oldest dinosaurs, such as Herrerasaurus and Eoraptor, come from Ischigualasto in Argentina. They were small to medium-sized and walked on two legs."),
   see=[("Parco provinciale di Ischigualasto (Argentina), patrimonio UNESCO", "Ischigualasto Provincial Park (Argentina), a UNESCO site", W('Ischigualasto_Provincial_Park')), ("MUSE – Museo delle Scienze di Trento", "MUSE – Science Museum, Trento", 'https://www.muse.it/')],
   read=["Steve Brusatte, The Rise and Fall of the Dinosaurs (2018) — it.: Ascesa e caduta dei dinosauri"],
   web=[("Wikipedia: Dinosaur", W('Dinosaur')), EONS])
ev('mammals', 225, '🐭', 'life', ("Primi mammaliformi", "First mammaliaforms"),
   ("Piccoli animali notturni grandi come un toporagno, con denti specializzati e orecchio medio che diventerà quello dei mammiferi. Vivranno all'ombra dei dinosauri per 160 milioni di anni.",
    "Small nocturnal animals the size of a shrew, with specialised teeth and a middle ear on its way to the mammal ear. They will live in the dinosaurs' shadow for 160 million years."),
   read=["Steve Brusatte, The Rise and Reign of the Mammals (2022)"],
   web=[("Wikipedia: Mammaliaformes", W('Mammaliaformes'))])
ev('end-triassic', 201, '💀', 'extinction', ("Estinzione di fine Triassico", "End-Triassic extinction"),
   ("La Pangea inizia a spaccarsi e le eruzioni della Provincia Magmatica Centro-Atlantica coprono milioni di km² di basalto. Spariscono molti rettili e anfibi: i dinosauri restano padroni del campo.",
    "Pangaea begins to split and the Central Atlantic Magmatic Province erupts basalt over millions of km². Many reptiles and amphibians vanish: dinosaurs are left in charge."),
   read=["Peter Brannen, The Ends of the World (2017)"],
   web=[("Wikipedia: Triassic–Jurassic extinction event", W('Triassic%E2%80%93Jurassic_extinction_event'))])
ev('atlantic', 180, '🌊', 'earth', ("Si apre l'Oceano Atlantico", "The Atlantic Ocean opens"),
   ("Il Nord America si stacca dall'Africa e tra i due nasce un nuovo oceano, che ancora oggi si allarga di pochi centimetri all'anno lungo la dorsale medio-atlantica. In Islanda la dorsale emerge sulla terraferma.",
    "North America pulls away from Africa and a new ocean is born between them; it still widens by a few centimetres a year along the Mid-Atlantic Ridge. In Iceland the ridge rises above sea level."),
   see=[("Þingvellir (Islanda), dove la dorsale è a cielo aperto", "Þingvellir (Iceland), where the ridge is on land", W('%C3%9Eingvellir'))],
   web=[("Wikipedia: Mid-Atlantic Ridge", W('Mid-Atlantic_Ridge'))])
ev('archaeopteryx', 150, '🪶', 'life', ("Archaeopteryx", "Archaeopteryx"),
   ("Trovato nel 1861 nei calcari litografici di Solnhofen, in Baviera, due anni dopo L'origine delle specie di Darwin: un dinosauro con penne, ali, denti e lunga coda. Oggi sappiamo che gli uccelli sono dinosauri.",
    "Found in 1861 in the lithographic limestone of Solnhofen, Bavaria, two years after Darwin's Origin of Species: a dinosaur with feathers, wings, teeth and a long tail. Today we know birds are dinosaurs."),
   see=[("Museum für Naturkunde (Berlino), con l'esemplare di Berlino", "Museum für Naturkunde (Berlin), with the Berlin specimen", W('Museum_f%C3%BCr_Naturkunde')), ("Natural History Museum (Londra)", "Natural History Museum (London)", W('Natural_History_Museum,_London'))],
   read=["Pat Shipman, Taking Wing (1998)"],
   web=[("Wikipedia: Archaeopteryx", WI('Archaeopteryx')), EONS])
ev('flowers', 130, '🌸', 'life', ("Prime piante con fiori", "First flowering plants"),
   ("Le angiosperme compaiono nel Cretacico Inferiore e in pochi milioni di anni conquistano il mondo, insieme agli insetti impollinatori. Darwin chiamava la loro rapida diffusione «un abominevole mistero».",
    "Angiosperms appear in the Early Cretaceous and within a few million years take over the world, together with pollinating insects. Darwin called their rapid spread «an abominable mystery»."),
   web=[("Wikipedia: Flowering plant", W('Flowering_plant'))])
ev('oae2', 94, '🖤', 'climate', ("Evento anossico oceanico 2", "Oceanic Anoxic Event 2"),
   ("Al limite Cenomaniano-Turoniano gli oceani restano senza ossigeno in profondità e si depositano scisti neri ricchi di materia organica in tutto il mondo. In Italia è il famoso Livello Bonarelli dell'Appennino umbro-marchigiano.",
    "At the Cenomanian–Turonian boundary the deep oceans run out of oxygen and black shales rich in organic matter are laid down worldwide. In Italy it is the famous Bonarelli Level of the Umbria-Marche Apennines."),
   see=[("Il Livello Bonarelli nella Gola del Bottaccione e in altre sezioni dell'Appennino umbro-marchigiano", "The Bonarelli Level in the Bottaccione Gorge and other sections of the Umbria-Marche Apennines", W('Gubbio'))],
   web=[("Wikipedia: Cenomanian-Turonian boundary event", W('Cenomanian-Turonian_boundary_event'))], el=['c'])
ev('trex', 68, '🦕', 'life', ("Tyrannosaurus rex", "Tyrannosaurus rex"),
   ("Uno dei più grandi predatori terrestri di sempre: lungo 12 metri, con il morso più potente noto tra gli animali terrestri. Visse negli ultimi milioni di anni del Cretacico, in Nord America.",
    "One of the largest land predators ever: 12 metres long, with the strongest known bite of any land animal. It lived in the last few million years of the Cretaceous, in North America."),
   see=[("Field Museum (Chicago), con lo scheletro di «Sue»", "Field Museum (Chicago), with the skeleton of «Sue»", W('Field_Museum_of_Natural_History'))],
   read=["Steve Brusatte, The Rise and Fall of the Dinosaurs (2018) — it.: Ascesa e caduta dei dinosauri"],
   web=[("Wikipedia: Tyrannosaurus", W('Tyrannosaurus'))])
ev('chicxulub', 66, '☄️', 'extinction', ("L'asteroide di Chicxulub: fine dei dinosauri non aviani", "The Chicxulub asteroid: end of non-avian dinosaurs"),
   ("Nel 1980 Luis e Walter Alvarez trovarono troppo iridio in un sottile strato d'argilla a Gubbio: veniva da un asteroide di circa 10 km. Il cratere fu poi trovato sepolto sotto lo Yucatán, in Messico. Scompaiono i dinosauri non aviani, le ammoniti e tre quarti delle specie.",
    "In 1980 Luis and Walter Alvarez found too much iridium in a thin clay layer at Gubbio: it came from an asteroid about 10 km across. The crater was later found buried under Yucatán, Mexico. Non-avian dinosaurs, ammonites and three quarters of all species vanish."),
   see=[("Il limite K-Pg nella Gola del Bottaccione, Gubbio (Umbria)", "The K-Pg boundary in the Bottaccione Gorge, Gubbio (Umbria)", W('Gubbio'))],
   read=["Walter Alvarez, T. rex and the Crater of Doom (1997)", "Alessandro Montanari, Christian Koeberl, Impact Stratigraphy: The Italian Record (2000)"],
   web=[("Wikipedia: Cretaceous–Paleogene extinction event", W('Cretaceous%E2%80%93Paleogene_extinction_event')), ("Wikipedia: Chicxulub crater", W('Chicxulub_crater'))],
   el=['ir'])
ev('petm', 56, '♨️', 'climate', ("Massimo Termico Paleocene-Eocene (PETM)", "Paleocene–Eocene Thermal Maximum (PETM)"),
   ("In poche migliaia di anni entrano nell'atmosfera migliaia di miliardi di tonnellate di carbonio e la Terra si scalda di 5–8 °C. Gli oceani si acidificano e i carbonati si sciolgono. È il miglior paragone geologico per il riscaldamento di oggi, che però è molto più veloce.",
    "Within a few thousand years thousands of billions of tonnes of carbon enter the atmosphere and Earth warms by 5–8 °C. Oceans acidify and carbonates dissolve. It is the best geological analogue for today's warming, which however is much faster."),
   see=[("Le scogliere di Zumaia (Paesi Baschi), dove il PETM è uno strato d'argilla", "The Zumaia cliffs (Basque Country), where the PETM is a clay bed", W('Zumaia'))],
   read=["Thomas Halliday, Otherlands (2022)"],
   web=[("Wikipedia: PETM", W('Paleocene%E2%80%93Eocene_Thermal_Maximum')), EONS], el=['c'])
ev('whales', 50, '🐋', 'life', ("Le prime balene", "The first whales"),
   ("Gli antenati delle balene erano mammiferi terrestri con zoccoli, parenti degli ippopotami. In 10 milioni di anni passano dalla terra al mare: Pakicetus, Ambulocetus, poi Basilosaurus con zampette posteriori ridotte.",
    "Whales' ancestors were hoofed land mammals, relatives of hippos. Within 10 million years they move from land to sea: Pakicetus, Ambulocetus, then Basilosaurus with tiny hind legs."),
   see=[("Wadi Al-Hitan, la «valle delle balene» (Egitto), patrimonio UNESCO", "Wadi Al-Hitan, the «Valley of the Whales» (Egypt), a UNESCO site", W('Wadi_Al-Hitan'))],
   read=["Carl Zimmer, At the Water's Edge (1998)"],
   web=[("Wikipedia: Evolution of cetaceans", W('Evolution_of_cetaceans'))])
ev('antarctica', 34, '🧊', 'climate', ("Ghiaccio permanente in Antartide", "Permanent ice in Antarctica"),
   ("La CO₂ cala e l'Antartide, isolata dalla corrente circumpolare dopo l'apertura dei passaggi di Drake e della Tasmania, si copre di una calotta di ghiaccio. Nei sedimenti marini il passaggio si vede come un salto negli isotopi dell'ossigeno; a Massignano, vicino ad Ancona, c'è il chiodo d'oro.",
    "CO₂ drops and Antarctica, cut off by the circumpolar current once the Drake and Tasmanian passages open, is covered by an ice sheet. In marine sediments the change shows as a jump in oxygen isotopes; the golden spike is at Massignano, near Ancona."),
   web=[("Wikipedia: Eocene–Oligocene extinction event", W('Eocene%E2%80%93Oligocene_extinction_event'))], el=['o'])
ev('messinian', 5.97, '🧂', 'earth', ("Il Mediterraneo si prosciuga (crisi messiniana)", "The Mediterranean dries out (Messinian crisis)"),
   ("Lo stretto che collega il Mediterraneo all'Atlantico si chiude e il mare evapora più volte, lasciando sul fondo gesso e sale spessi fino a 2–3 km. La scoperta venne dalla nave da perforazione Glomar Challenger nel 1970.",
    "The strait linking the Mediterranean to the Atlantic closes and the sea evaporates again and again, leaving gypsum and salt up to 2–3 km thick on its floor. The discovery came from the drilling ship Glomar Challenger in 1970."),
   see=[("Parco della Vena del Gesso Romagnola (Emilia-Romagna)", "Vena del Gesso Romagnola park (Emilia-Romagna)", WI('Parco_regionale_della_Vena_del_Gesso_Romagnola')), ("Le miniere di salgemma e i gessi della Sicilia", "The rock-salt mines and gypsum of Sicily", WI('Serie_gessoso-solfifera'))],
   read=["Kenneth J. Hsü, The Mediterranean Was a Desert (1983)"],
   web=[("Wikipedia: Crisi di salinità del Messiniano", WI('Crisi_di_salinit%C3%A0_del_Messiniano'))], el=['na', 'cl', 'ca', 's'])
ev('zanclean', 5.33, '🌊', 'earth', ("L'inondazione zanclea riempie il Mediterraneo", "The Zanclean flood refills the Mediterranean"),
   ("L'Atlantico rompe la soglia di Gibilterra e riempie il bacino, forse in pochi mesi o anni, scavando un canale profondo centinaia di metri. A Eraclea Minoa, in Sicilia, le marne bianche dei Trubi poggiano di colpo sui depositi del mare prosciugato.",
    "The Atlantic breaks through the Gibraltar sill and refills the basin, perhaps within months or years, carving a channel hundreds of metres deep. At Eraclea Minoa, Sicily, the white Trubi marls sit abruptly on the deposits of the dried sea."),
   see=[("Eraclea Minoa e la Scala dei Turchi (Sicilia)", "Eraclea Minoa and the Scala dei Turchi (Sicily)", W('Scala_dei_Turchi'))],
   web=[("Wikipedia: Zanclean flood", W('Zanclean_flood'))])
ev('lucy', 3.2, '👣', 'human', ("Lucy (Australopithecus afarensis)", "Lucy (Australopithecus afarensis)"),
   ("Lo scheletro scoperto nel 1974 ad Hadar, in Etiopia: camminava eretta ma aveva un cervello piccolo come quello di uno scimpanzé. Il nome viene dalla canzone dei Beatles che suonava al campo la sera della scoperta.",
    "The skeleton found in 1974 at Hadar, Ethiopia: she walked upright but had a brain as small as a chimpanzee's. The name comes from the Beatles song playing at camp on the night of the discovery."),
   see=[("Museo Nazionale d'Etiopia (Addis Abeba)", "National Museum of Ethiopia (Addis Ababa)", W('National_Museum_of_Ethiopia'))],
   read=["Donald Johanson, Maitland Edey, Lucy: The Beginnings of Humankind (1981)"],
   web=[("Wikipedia: Lucy (Australopithecus)", W('Lucy_(Australopithecus)'))])
ev('oldowan', 2.6, '🪓', 'human', ("Primi strumenti olduvaiani", "First Oldowan tools"),
   ("Ciottoli scheggiati per ottenere un bordo tagliente, usati per spezzare ossa e tagliare carne. Prendono nome dalla gola di Olduvai, in Tanzania.",
    "Pebbles chipped to make a sharp edge, used to break bones and cut meat. They are named after Olduvai Gorge in Tanzania."),
   see=[("Gola di Olduvai (Tanzania)", "Olduvai Gorge (Tanzania)", W('Olduvai_Gorge'))],
   web=[("Wikipedia: Oldowan", W('Oldowan'))])
ev('reversal', 0.773, '🧭', 'earth', ("Ultima inversione del campo magnetico", "Last magnetic field reversal"),
   ("Il campo magnetico della Terra si capovolge di tanto in tanto: i minerali magnetici delle rocce lo registrano come una bussola fossile. L'ultima inversione, Matuyama–Brunhes, segna la base del Chibaniano.",
    "Earth's magnetic field flips from time to time: magnetic minerals in rocks record it like a fossil compass. The last reversal, Matuyama–Brunhes, marks the base of the Chibanian."),
   web=[("Wikipedia: Brunhes–Matuyama reversal", W('Brunhes%E2%80%93Matuyama_reversal')), ("Wikipedia: Geomagnetic reversal", W('Geomagnetic_reversal'))],
   el=['fe'])
ev('sapiens', 0.3, '🧍', 'human', ("Homo sapiens", "Homo sapiens"),
   ("I fossili più antichi della nostra specie vengono da Jebel Irhoud, in Marocco, e hanno circa 300 000 anni. Da allora Homo sapiens si diffonde in tutto il pianeta, incontrando i Neanderthal e altre umanità.",
    "The oldest fossils of our species come from Jebel Irhoud, Morocco, and are about 300,000 years old. Since then Homo sapiens has spread across the planet, meeting Neanderthals and other humans."),
   read=["Telmo Pievani, Homo sapiens e altre catastrofi (2018)"],
   web=[("Wikipedia: Jebel Irhoud", W('Jebel_Irhoud')), ("Wikipedia: Homo sapiens", W('Homo_sapiens'))])
ev('farming', 0.0117, '🌾', 'human', ("Fine dell'era glaciale e prime coltivazioni", "End of the ice age and first farming"),
   ("Finita l'ultima glaciazione, nella Mezzaluna Fertile si iniziano a coltivare grano e orzo e ad allevare capre e pecore. Nascono i villaggi stabili: è l'inizio dell'Olocene.",
    "After the last glaciation, people in the Fertile Crescent begin to grow wheat and barley and to herd goats and sheep. Permanent villages arise: it is the start of the Holocene."),
   see=[("Göbekli Tepe (Turchia), patrimonio UNESCO", "Göbekli Tepe (Turkey), a UNESCO site", W('G%C3%B6bekli_Tepe'))],
   read=["Jared Diamond, Guns, Germs, and Steel (1997) — it.: Armi, acciaio e malattie", "Richard B. Alley, The Two-Mile Time Machine (2000)"],
   web=[("Wikipedia: Neolithic Revolution", W('Neolithic_Revolution'))])
ev('drought', 0.0042, '🏜️', 'climate', ("La siccità di 4200 anni fa", "The 4,200-year-ago drought"),
   ("Circa due secoli di siccità colpiscono il Mediterraneo orientale, il Medio Oriente e l'India: l'Antico Regno egizio e l'impero accadico entrano in crisi. Una stalagmite indiana ne conserva la traccia ed è diventata il chiodo d'oro del Meghalayano.",
    "About two centuries of drought hit the eastern Mediterranean, the Middle East and India: Egypt's Old Kingdom and the Akkadian empire falter. An Indian stalagmite keeps the record and became the golden spike of the Meghalayan."),
   read=["Brian Fagan, The Long Summer (2004)"],
   web=[("Wikipedia: 4.2-kiloyear event", W('4.2-kiloyear_event'))])


# ---------------------------------------------------------------- plate tectonics, oceans and mountain ranges
ev('nuna', 1800, '🧲', 'earth', ("Il supercontinente Columbia (Nuna)", "The supercontinent Columbia (Nuna)"),
   ("Uno dei primi supercontinenti ricostruiti con sicurezza: si forma tra 2,1 e 1,8 miliardi di anni fa con una serie di orogenesi e si smembra circa 1,4 miliardi di anni fa. I suoi frammenti sono oggi i nuclei di Nord America, Baltica, Siberia, Australia e Cina.",
    "One of the first supercontinents to be reconstructed with confidence: it assembles between 2.1 and 1.8 billion years ago through a series of orogenies and breaks up about 1.4 billion years ago. Its pieces are now the cores of North America, Baltica, Siberia, Australia and China."),
   read=["Ted Nield, Supercontinent (2007)"],
   web=[("Wikipedia: Columbia (supercontinent)", W('Columbia_(supercontinent)'))])
ev('panthalassa', 750, '🌐', 'earth', ("Rodinia si spacca: nasce Panthalassa", "Rodinia breaks up: Panthalassa is born"),
   ("Il rifting divide Rodinia in più blocchi; tra di essi si apre il grande oceano Panthalassa, che circonderà poi la Pangea e di cui il Pacifico è l'ultimo erede. Le eruzioni e l'erosione legate a questa rottura potrebbero aver innescato le glaciazioni della Terra a palla di neve.",
    "Rifting splits Rodinia into several blocks; between them opens the great Panthalassa ocean, which will later surround Pangaea and whose last heir is the Pacific. The eruptions and weathering tied to this break-up may have triggered the Snowball Earth glaciations."),
   web=[("Wikipedia: Panthalassa", W('Panthalassa')), ("Wikipedia: Rodinia", WI('Rodinia'))])
ev('gondwana', 550, '🌍', 'earth', ("Si assembla il Gondwana", "Gondwana assembles"),
   ("Con l'orogenesi panafricana Africa, Sud America, Antartide, India e Australia si saldano nel grande continente meridionale del Gondwana. Anche i pezzi di crosta che oggi formano gran parte dell'Italia erano allora ai margini del Gondwana.",
    "Through the Pan-African orogeny, Africa, South America, Antarctica, India and Australia weld into the great southern continent of Gondwana. The pieces of crust that now make up much of Italy also lay at the edge of Gondwana then."),
   web=[("Wikipedia: Gondwana", W('Gondwana')), ("Wikipedia: Pan-African orogeny", W('Pan-African_orogeny'))])
ev('caledonian', 420, '🏔️', 'earth', ("Orogenesi caledoniana: si chiude l'oceano Giapeto", "Caledonian orogeny: the Iapetus Ocean closes"),
   ("Laurentia (il Nord America), Baltica e Avalonia si scontrano e l'oceano Giapeto scompare. Nascono montagne alte come l'Himalaya, oggi consumate: le Highlands scozzesi, le montagne della Norvegia, parte degli Appalachi. A Siccar Point James Hutton capì, nel 1788, quanto è profondo il tempo.",
    "Laurentia (North America), Baltica and Avalonia collide and the Iapetus Ocean disappears. Mountains as high as the Himalaya rise, now worn down: the Scottish Highlands, the mountains of Norway, part of the Appalachians. At Siccar Point, in 1788, James Hutton realised how deep time is."),
   see=[("Siccar Point (Scozia), la discordanza di Hutton", "Siccar Point (Scotland), Hutton's unconformity", W('Siccar_Point'))],
   read=["Richard Fortey, Earth: An Intimate History (2004)"],
   web=[("Wikipedia: Caledonian orogeny", W('Caledonian_orogeny')), ("Wikipedia: Iapetus Ocean", W('Iapetus_Ocean'))])
ev('variscan', 330, '⛰️', 'earth', ("Orogenesi varisica (ercinica)", "Variscan (Hercynian) orogeny"),
   ("Il Gondwana urta l'Euramerica e si forma una catena lunga migliaia di chilometri, dagli Appalachi all'Europa centrale. È la collisione che costruisce la Pangea. In Italia ne restano i graniti e gli scisti della Sardegna, della Calabria e il basamento delle Alpi.",
    "Gondwana collides with Euramerica and a range thousands of kilometres long forms, from the Appalachians to central Europe. This is the collision that builds Pangaea. In Italy its granites and schists survive in Sardinia, Calabria and the basement of the Alps."),
   see=[("I graniti della Gallura e il basamento della Sardegna", "The granites of Gallura and the basement of Sardinia", W('Sardinia'))],
   web=[("Wikipedia: Variscan orogeny", W('Variscan_orogeny')), ("Wikipedia: Appalachian Mountains", W('Appalachian_Mountains'))])
ev('urals', 290, '🗻', 'earth', ("Si sollevano gli Urali", "The Urals rise"),
   ("Siberia e Kazakistania si saldano all'Europa orientale: gli Urali sono la cicatrice di questa collisione, l'ultimo tassello della Pangea. Ancora oggi segnano il confine convenzionale tra Europa e Asia.",
    "Siberia and Kazakhstania weld onto eastern Europe: the Urals are the scar of that collision, the last piece of Pangaea. They still mark the conventional boundary between Europe and Asia."),
   web=[("Wikipedia: Uralian orogeny", W('Uralian_orogeny'))])
ev('neotethys', 260, '🌊', 'earth', ("Si apre la Neotetide", "The Neo-Tethys opens"),
   ("Una striscia di continenti (i blocchi cimmerici, oggi Turchia, Iran e Tibet) si stacca dal Gondwana e migra verso nord: dietro si apre un nuovo oceano, la Neotetide. Sui suoi margini si depositano i calcari e le dolomie che oggi formano gran parte delle montagne italiane.",
    "A strip of continents (the Cimmerian blocks, now Turkey, Iran and Tibet) breaks away from Gondwana and drifts north: behind it a new ocean opens, the Neo-Tethys. On its margins the limestones and dolostones were laid down that now make up much of Italy's mountains."),
   web=[("Wikipedia: Tethys Ocean", W('Tethys_Ocean'))])
ev('rifting', 230, '↔️', 'earth', ("Inizia il rifting della Pangea", "The rifting of Pangaea begins"),
   ("La crosta della Pangea si stira e si spacca lungo lunghe fosse tettoniche, che si riempiono di sedimenti rossi e di laghi, come il bacino di Newark negli Stati Uniti. Da queste fratture nasceranno l'Atlantico e l'oceano ligure-piemontese.",
    "Pangaea's crust stretches and breaks along long rift valleys that fill with red sediments and lakes, such as the Newark Basin in the United States. From these fractures the Atlantic and the Ligurian-Piedmont ocean will be born."),
   web=[("Wikipedia: Rift", W('Rift')), ("Wikipedia: Newark Basin", W('Newark_Basin'))])
ev('ligurian-ocean', 170, '🟢', 'earth', ("Si apre l'oceano ligure-piemontese", "The Ligurian-Piedmont Ocean opens"),
   ("Tra Europa e Adria (la microplacca su cui poggia gran parte dell'Italia) si apre un piccolo oceano, ramo della Tetide. Della sua crosta oceanica restano le ofioliti: basalti a cuscino, gabbri e serpentiniti, le «pietre verdi» delle Alpi occidentali e dell'Appennino ligure ed emiliano.",
    "Between Europe and Adria (the microplate on which most of Italy rests) a small ocean opens, a branch of the Tethys. Its oceanic crust survives as ophiolites: pillow basalts, gabbros and serpentinites, the «green stones» of the western Alps and of the Ligurian and Emilian Apennines."),
   see=[("Il Monviso, una crosta oceanica giurassica sollevata a 3841 m", "Monviso, Jurassic oceanic crust raised to 3,841 m", W('Monviso')), ("Le ofioliti del Bracco e della Val di Vara (Liguria)", "The ophiolites of Bracco and Val di Vara (Liguria)", W('Ophiolite'))],
   web=[("Wikipedia: Piemont-Liguria Ocean", W('Piemont-Liguria_Ocean')), ("Wikipedia: Ophiolite", W('Ophiolite'))], el=['mg', 'fe'])
ev('south-atlantic', 120, '🌊', 'earth', ("Si apre l'Atlantico meridionale", "The South Atlantic opens"),
   ("Africa e Sud America si separano, come una cerniera che si apre da sud verso nord. Nei primi bacini, poco profondi e caldi, si depositano spessi strati di sale, sotto cui oggi si trova il petrolio delle coste del Brasile e dell'Angola.",
    "Africa and South America split apart, like a zip opening from south to north. In the first shallow, warm basins thick salt layers were laid down; beneath them lies today's oil off Brazil and Angola."),
   web=[("Wikipedia: Atlantic Ocean (geology)", W('Atlantic_Ocean')), ("Wikipedia: Gondwana", W('Gondwana'))], el=['na'])
ev('laramide', 70, '🏜️', 'earth', ("Orogenesi laramide: nascono le Montagne Rocciose", "Laramide orogeny: the Rocky Mountains rise"),
   ("Una placca oceanica scorre in modo molto piatto sotto il Nord America e solleva montagne lontane dalla costa: le Montagne Rocciose. Il sollevamento continua fino a circa 50 milioni di anni fa.",
    "An oceanic plate slides very flat beneath North America and lifts mountains far from the coast: the Rocky Mountains. Uplift goes on until about 50 million years ago."),
   read=["John McPhee, Annals of the Former World (1998)"],
   web=[("Wikipedia: Laramide orogeny", W('Laramide_orogeny'))])
ev('deccan', 66.3, '🌋', 'extinction', ("Le eruzioni dei Trappi del Deccan", "The Deccan Traps eruptions"),
   ("In India, colate di basalto spesse in tutto oltre 2 km si accumulano a cavallo del limite Cretacico-Paleogene. Il loro ruolo nell'estinzione, accanto all'asteroide, è ancora discusso: probabilmente hanno indebolito gli ecosistemi e rallentato la ripresa.",
    "In India, basalt flows totalling over 2 km in thickness pile up across the Cretaceous–Paleogene boundary. Their role in the extinction, alongside the asteroid, is still debated: they probably stressed ecosystems and slowed the recovery."),
   web=[("Wikipedia: Deccan Traps", W('Deccan_Traps'))])
ev('himalaya', 50, '🏔️', 'earth', ("L'India urta l'Asia: nasce l'Himalaya", "India hits Asia: the Himalaya is born"),
   ("Dopo un viaggio di migliaia di chilometri verso nord, l'India si scontra con l'Asia e la Neotetide si chiude. Lo scontro continua ancora: l'Himalaya cresce di qualche millimetro all'anno e sulla cima dell'Everest ci sono calcari marini dell'Ordoviciano.",
    "After a journey of thousands of kilometres north, India collides with Asia and the Neo-Tethys closes. The collision is still going on: the Himalaya grows a few millimetres a year, and the summit of Everest is made of Ordovician marine limestone."),
   read=["Richard Fortey, Earth: An Intimate History (2004)"],
   web=[("Wikipedia: Himalayas (geology)", W('Geology_of_the_Himalayas')), ("Wikipedia: Mount Everest", W('Mount_Everest'))], el=['ca'])
ev('alps', 35, '🏔️', 'earth', ("La collisione che solleva le Alpi", "The collision that raises the Alps"),
   ("Chiuso l'oceano ligure-piemontese, Adria (con l'Africa alle spalle) urta l'Europa. Le rocce si accavallano in grandi falde: sul Cervino la cima è fatta di rocce della placca adriatica appoggiate sopra resti di fondale oceanico e crosta europea.",
    "Once the Ligurian-Piedmont ocean has closed, Adria (with Africa behind it) hits Europe. The rocks stack up in great nappes: on the Matterhorn the summit is made of Adriatic-plate rocks resting on remains of ocean floor and European crust."),
   see=[("Il Cervino (Valle d'Aosta e Svizzera)", "The Matterhorn (Aosta Valley and Switzerland)", W('Matterhorn')), ("Il Monviso (Piemonte)", "Monviso (Piedmont)", W('Monviso'))],
   web=[("Wikipedia: Alpine orogeny", W('Alpine_orogeny')), ("Wikipedia: Geology of the Alps", W('Geology_of_the_Alps'))])
ev('red-sea', 30, '🔥', 'earth', ("Si apre la Rift Valley africana e il Mar Rosso", "The East African Rift and the Red Sea open"),
   ("Sopra un pennacchio caldo del mantello, nella regione di Afar, la crosta si gonfia e si spacca in tre bracci: il Mar Rosso, il Golfo di Aden e la Rift Valley africana. È un oceano che sta nascendo sotto i nostri occhi.",
    "Above a hot mantle plume, in the Afar region, the crust swells and splits into three arms: the Red Sea, the Gulf of Aden and the East African Rift. It is an ocean being born before our eyes."),
   web=[("Wikipedia: East African Rift", W('East_African_Rift')), ("Wikipedia: Afar Triangle", W('Afar_Triangle'))])
ev('apennines', 23, '⛰️', 'earth', ("Nasce l'Appennino", "The Apennines are born"),
   ("Dall'Oligocene-Miocene la placca adriatica scende sotto l'Italia e la catena appenninica cresce migrando verso est, accavallando le rocce della Tetide: calcari, marne e flysch. Il fronte della catena è attivo ancora oggi, come ricordano i terremoti.",
    "From the Oligocene–Miocene the Adriatic plate sinks beneath Italy and the Apennine chain grows, migrating eastwards and stacking up Tethyan rocks: limestones, marls and flysch. The front of the chain is still active today, as earthquakes remind us."),
   see=[("Il Gran Sasso e la Majella (Abruzzo)", "Gran Sasso and Majella (Abruzzo)", W('Gran_Sasso_d%27Italia'))],
   web=[("Wikipedia: Apennine Mountains", W('Apennine_Mountains'))])
ev('sardinia-rotation', 18, '🔄', 'earth', ("Corsica e Sardegna ruotano: si apre il Mar Ligure", "Corsica and Sardinia rotate: the Ligurian Sea opens"),
   ("Il blocco sardo-corso si stacca dalla Provenza e dalla Catalogna e ruota in senso antiorario di circa 30 gradi, mentre dietro si apre il bacino ligure-provenzale. Le rocce sarde, infatti, assomigliano a quelle della Francia meridionale.",
    "The Corsica–Sardinia block breaks away from Provence and Catalonia and rotates anticlockwise by about 30 degrees, while the Ligurian-Provençal basin opens behind it. That is why Sardinian rocks resemble those of southern France."),
   web=[("Wikipedia: Ligurian Sea", W('Ligurian_Sea'))])
ev('tyrrhenian', 8, '🌋', 'earth', ("Si apre il Mar Tirreno", "The Tyrrhenian Sea opens"),
   ("Mentre l'Appennino avanza verso est, dietro la catena la crosta si stira e sprofonda: nasce il Tirreno, il bacino più giovane del Mediterraneo, con fondali oltre 3500 m. Lungo i suoi margini nascono i vulcani dell'Italia tirrenica e l'arco delle Eolie.",
    "As the Apennines advance east, the crust behind the chain stretches and sinks: the Tyrrhenian Sea is born, the youngest basin of the Mediterranean, more than 3,500 m deep. Along its margins rise the volcanoes of Tyrrhenian Italy and the Aeolian arc."),
   see=[("Le isole Eolie, patrimonio UNESCO", "The Aeolian Islands, a UNESCO site", W('Aeolian_Islands'))],
   web=[("Wikipedia: Tyrrhenian Sea", W('Tyrrhenian_Sea'))])
ev('panama', 2.8, '🌉', 'earth', ("Si chiude l'istmo di Panama", "The Isthmus of Panama closes"),
   ("Le Americhe si uniscono: animali del nord e del sud si mescolano (il «grande scambio americano») e le correnti oceaniche cambiano, rafforzando la Corrente del Golfo. Potrebbe aver contribuito all'inizio delle glaciazioni dell'emisfero nord.",
    "The Americas join: northern and southern animals mix (the «Great American Interchange») and ocean currents change, strengthening the Gulf Stream. It may have helped start the Northern Hemisphere ice ages."),
   web=[("Wikipedia: Isthmus of Panama", W('Isthmus_of_Panama')), ("Wikipedia: Great American Interchange", W('Great_American_Interchange'))])

E.sort(key=lambda x: -x['a'])
