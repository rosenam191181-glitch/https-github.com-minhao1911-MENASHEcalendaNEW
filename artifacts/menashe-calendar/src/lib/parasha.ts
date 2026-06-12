import { HebrewCalendar, HDate, flags } from "@hebcal/core";

export interface ParashaInfo {
  name: string;
  hebrewName: string;
  book: string;
  verses: string;
  summary: string;
  number: number;
  total: number;
}

const PARASHA_DATA: Record<string, { hebrew: string; book: string; verses: string; summary: string; number: number }> = {
  "Bereshit": { hebrew: "בְּרֵאשִׁית", book: "Bereishit", verses: "1:1–6:8", summary: "God creates the world in six days, then rests. Adam and Eve are placed in the Garden of Eden, eat from the forbidden tree, and are expelled. Cain kills Abel. The genealogy from Adam to Noah is listed.", number: 1 },
  "Noach": { hebrew: "נֹחַ", book: "Bereishit", verses: "6:9–11:32", summary: "God commands Noah to build an ark to survive a great flood that will destroy the corrupted world. After the flood, God establishes a covenant with Noah, marked by a rainbow. The Tower of Babel is built and destroyed.", number: 2 },
  "Lech-Lecha": { hebrew: "לֶךְ-לְךָ", book: "Bereishit", verses: "12:1–17:27", summary: "God commands Abram to leave his homeland and go to Canaan, promising to make him a great nation. Abram travels through Canaan and Egypt. God makes a covenant with Abram and changes his name to Abraham.", number: 3 },
  "Vayeira": { hebrew: "וַיֵּרָא", book: "Bereishit", verses: "18:1–22:24", summary: "God and angels visit Abraham, promising him a son. Sodom and Gomorrah are destroyed. Isaac is born. Abraham is commanded to sacrifice Isaac but an angel stops him at the last moment.", number: 4 },
  "Chayei Sara": { hebrew: "חַיֵּי שָׂרָה", book: "Bereishit", verses: "23:1–25:18", summary: "Sarah dies and Abraham purchases the Cave of Machpelah as her burial place. Abraham sends his servant to find a wife for Isaac; Rebekah is chosen. Abraham remarries and eventually dies.", number: 5 },
  "Toldot": { hebrew: "תּוֹלְדֹת", book: "Bereishit", verses: "25:19–28:9", summary: "Isaac and Rebekah have twin sons: Esau and Jacob. Esau sells his birthright to Jacob. Jacob deceives his blind father Isaac and receives the blessing meant for Esau.", number: 6 },
  "Vayetzei": { hebrew: "וַיֵּצֵא", book: "Bereishit", verses: "28:10–32:3", summary: "Jacob flees to his uncle Laban. He dreams of a ladder to heaven. He works for Laban to marry Rachel and Leah. His twelve sons are born. He eventually flees from Laban.", number: 7 },
  "Vayishlach": { hebrew: "וַיִּשְׁלַח", book: "Bereishit", verses: "32:4–36:43", summary: "Jacob wrestles with an angel and is renamed Israel. He is reconciled with Esau. His daughter Dinah is assaulted; her brothers take revenge. Rachel dies giving birth to Benjamin.", number: 8 },
  "Vayeshev": { hebrew: "וַיֵּשֶׁב", book: "Bereishit", verses: "37:1–40:23", summary: "Jacob favors Joseph, who receives a coat of many colors. Joseph's brothers sell him into slavery in Egypt. Joseph serves Potiphar but is imprisoned. He interprets dreams in prison.", number: 9 },
  "Miketz": { hebrew: "מִקֵּץ", book: "Bereishit", verses: "41:1–44:17", summary: "Pharaoh has two dreams; Joseph interprets them as seven years of plenty followed by famine. Joseph is appointed viceroy of Egypt. His brothers come to buy grain; Joseph recognizes them but they do not recognize him.", number: 10 },
  "Vayigash": { hebrew: "וַיִּגַּשׁ", book: "Bereishit", verses: "44:18–47:27", summary: "Judah pleads for Benjamin's release. Joseph reveals himself to his brothers. Jacob and his family move to Egypt. Joseph provides land in Goshen for his family.", number: 11 },
  "Vayechi": { hebrew: "וַיְחִי", book: "Bereishit", verses: "47:28–50:26", summary: "Jacob blesses his sons and grandchildren before dying. Joseph promises to bury Jacob in Canaan. Jacob is buried with great ceremony. Joseph forgives his brothers and dies in Egypt.", number: 12 },
  "Shemot": { hebrew: "שְׁמוֹת", book: "Shemot", verses: "1:1–6:1", summary: "The Israelites are enslaved in Egypt. Moses is born, placed in a basket on the Nile, and raised in Pharaoh's palace. God appears to Moses in a burning bush and commands him to lead the Israelites out of Egypt.", number: 13 },
  "Vaeira": { hebrew: "וָאֵרָא", book: "Shemot", verses: "6:2–9:35", summary: "God tells Moses and Aaron to go to Pharaoh. The first seven plagues—blood, frogs, lice, wild animals, pestilence, boils, and hail—strike Egypt. Pharaoh repeatedly refuses to free the Israelites.", number: 14 },
  "Bo": { hebrew: "בֹּא", book: "Shemot", verses: "10:1–13:16", summary: "The final three plagues—locusts, darkness, and death of the firstborn—strike Egypt. God commands the Passover sacrifice. Pharaoh finally lets the Israelites go; they leave Egypt in haste.", number: 15 },
  "Beshalach": { hebrew: "בְּשַׁלַּח", book: "Shemot", verses: "13:17–17:16", summary: "Pharaoh changes his mind and pursues the Israelites. God splits the Red Sea; the Israelites cross safely while the Egyptian army drowns. Moses and Miriam sing songs of praise. The manna begins.", number: 16 },
  "Yitro": { hebrew: "יִתְרוֹ", book: "Shemot", verses: "18:1–20:23", summary: "Moses's father-in-law Jethro visits and advises on governance. God reveals the Torah at Mount Sinai. The Ten Commandments are given amid thunder, lightning, and a shofar blast.", number: 17 },
  "Mishpatim": { hebrew: "מִּשְׁפָּטִים", book: "Shemot", verses: "21:1–24:18", summary: "God gives Moses a large body of civil and religious law including rules about slavery, personal injury, property, and moral behavior. The people accept the Torah. Moses ascends Sinai for 40 days.", number: 18 },
  "Terumah": { hebrew: "תְּרוּמָה", book: "Shemot", verses: "25:1–27:19", summary: "God instructs Moses on building the Tabernacle and its furnishings—the ark, table, menorah, and altar—using donations from the people. Detailed measurements and materials are specified.", number: 19 },
  "Tetzaveh": { hebrew: "תְּצַוֶּה", book: "Shemot", verses: "27:20–30:10", summary: "God gives instructions for the menorah oil and the priestly garments—the ephod, breastplate, robe, tunic, and turban. The ordination ceremony for Aaron and his sons is described.", number: 20 },
  "Ki Tisa": { hebrew: "כִּי תִשָּׂא", book: "Shemot", verses: "30:11–34:35", summary: "Moses takes a census. While Moses receives the Torah on Sinai, the people build the Golden Calf. Moses breaks the tablets, destroys the calf, and pleads for the people. New tablets are made.", number: 21 },
  "Vayakhel": { hebrew: "וַיַּקְהֵל", book: "Shemot", verses: "35:1–38:20", summary: "Moses assembles the people and repeats the Shabbat commandment. Gifts are collected for the Tabernacle. Bezalel and Oholiab lead the construction of the Tabernacle and its furnishings.", number: 22 },
  "Pekudei": { hebrew: "פְקוּדֵי", book: "Shemot", verses: "38:21–40:38", summary: "An accounting of the materials used for the Tabernacle is given. The completed Tabernacle is assembled and dedicated. God's presence fills the Tabernacle; a cloud guides the Israelites on their journeys.", number: 23 },
  "Vayikra": { hebrew: "וַיִּקְרָא", book: "Vayikra", verses: "1:1–5:26", summary: "God calls to Moses from the Tent of Meeting and begins teaching the laws of sacrifices—burnt offerings, grain offerings, peace offerings, sin offerings, and guilt offerings.", number: 24 },
  "Tzav": { hebrew: "צַו", book: "Vayikra", verses: "6:1–8:36", summary: "Further instructions about sacrifices are given to Aaron and the priests. The seven-day ordination ceremony for Aaron and his sons is described and carried out.", number: 25 },
  "Shemini": { hebrew: "שְּׁמִינִי", book: "Vayikra", verses: "9:1–11:47", summary: "On the eighth day of the ordination, Aaron offers sacrifices and God's fire consumes the offerings. Aaron's sons Nadab and Abihu offer strange fire and die. The dietary laws (kashrut) are given.", number: 26 },
  "Tazria": { hebrew: "תַזְרִיעַ", book: "Vayikra", verses: "12:1–13:59", summary: "Laws of purity after childbirth are given. Detailed laws of tzara'at (a skin condition), including diagnosis by a priest and isolation procedures, are described.", number: 27 },
  "Metzora": { hebrew: "מְּצֹרָע", book: "Vayikra", verses: "14:1–15:33", summary: "Purification rituals for a person healed of tzara'at are described. Laws about tzara'at in clothing and houses follow. Laws of ritual impurity from bodily discharges are given.", number: 28 },
  "Achrei Mot": { hebrew: "אַחֲרֵי מוֹת", book: "Vayikra", verses: "16:1–18:30", summary: "After the deaths of Aaron's sons, God gives Aaron instructions for the Yom Kippur service, including the two goats and the scapegoat. Laws prohibiting certain sexual relationships are given.", number: 29 },
  "Kedoshim": { hebrew: "קְדֹשִׁים", book: "Vayikra", verses: "19:1–20:27", summary: "God commands Israel to be holy. A wide range of ethical, ritual, and social laws follow, including love your neighbor as yourself, honoring parents, and prohibitions on various immoral behaviors.", number: 30 },
  "Emor": { hebrew: "אֱמֹר", book: "Vayikra", verses: "21:1–24:23", summary: "Laws of priestly purity and conduct are given. The Jewish calendar and its holidays are described. Laws about the menorah and showbread follow. The blasphemer is stoned.", number: 31 },
  "Behar": { hebrew: "בְּהַר", book: "Vayikra", verses: "25:1–26:2", summary: "Laws of the Sabbatical year (shemitah) and Jubilee year (yovel) are given. Laws about redeeming property and freeing slaves in the Jubilee year follow.", number: 32 },
  "Bechukotai": { hebrew: "בְּחֻקֹּתַי", book: "Vayikra", verses: "26:3–27:34", summary: "God promises blessings for following His commandments and severe punishments (the tochecha) for disobedience. Laws of vows and dedications to the Tabernacle conclude the book.", number: 33 },
  "Bamidbar": { hebrew: "בְּמִדְבַּר", book: "Bamidbar", verses: "1:1–4:20", summary: "God commands a census of the Israelites. The tribes are counted and arranged around the Tabernacle. The Levites are set apart to serve the Tabernacle.", number: 34 },
  "Nasso": { hebrew: "נָשֹׂא", book: "Bamidbar", verses: "4:21–7:89", summary: "The Levite families' duties are assigned. The sotah ritual for a suspected unfaithful wife and the Nazirite vow are described. The Priestly Blessing is given. The tribal leaders bring offerings.", number: 35 },
  "Beha'alotcha": { hebrew: "בְּהַעֲלֹתְךָ", book: "Bamidbar", verses: "8:1–12:16", summary: "Instructions for the menorah lighting and Levite purification. The second Passover is instituted. The people complain about the manna; quail are sent. Miriam and Aaron speak against Moses.", number: 36 },
  "Shelach": { hebrew: "שְׁלַח", book: "Bamidbar", verses: "13:1–15:41", summary: "Moses sends twelve spies to scout Canaan. Ten return with a discouraging report; the people despair. God decrees the generation will die in the desert. Caleb and Joshua alone will enter the land.", number: 37 },
  "Korach": { hebrew: "קֹרַח", book: "Bamidbar", verses: "16:1–18:32", summary: "Korach and 250 followers rebel against Moses and Aaron. God causes the earth to swallow Korach's faction and fire consumes the 250. A plague follows; Aaron's staff miraculously blooms.", number: 38 },
  "Chukat": { hebrew: "חֻקַּת", book: "Bamidbar", verses: "19:1–22:1", summary: "The laws of the red heifer for purification from contact with the dead. Miriam dies. Moses strikes the rock instead of speaking to it and is forbidden from entering Canaan. Aaron dies.", number: 39 },
  "Balak": { hebrew: "בָּלָק", book: "Bamidbar", verses: "22:2–25:9", summary: "Balak, king of Moab, hires Balaam to curse Israel. God causes Balaam's donkey to speak. Balaam can only bless Israel instead of curse them. The people sin with the daughters of Moab.", number: 40 },
  "Pinchas": { hebrew: "פִּינְחָס", book: "Bamidbar", verses: "25:10–30:1", summary: "Pinchas receives a covenant of peace for stopping the plague. A new census is taken. The daughters of Zelophehad petition for inheritance rights. Moses is told to transfer leadership to Joshua.", number: 41 },
  "Matot": { hebrew: "מַּטּוֹת", book: "Bamidbar", verses: "30:2–32:42", summary: "Laws of vows and oaths are given. Israel wages war against Midian. The tribes of Reuben and Gad request to settle east of the Jordan; Moses agrees on condition they fight with Israel first.", number: 42 },
  "Masei": { hebrew: "מַסְעֵי", book: "Bamidbar", verses: "33:1–36:13", summary: "The forty-two journeys of Israel in the desert are listed. Boundaries of the Land of Israel are given. Cities of refuge for accidental killers are designated. Laws of inheritance finalize the book.", number: 43 },
  "Devarim": { hebrew: "דְּבָרִים", book: "Devarim", verses: "1:1–3:22", summary: "Moses begins his farewell address, recounting Israel's journey from Sinai through the desert. He reviews the appointment of judges and the sending of the twelve spies.", number: 44 },
  "Vaetchanan": { hebrew: "וָאֶתְחַנַּן", book: "Devarim", verses: "3:23–7:11", summary: "Moses pleads with God to enter Canaan but is refused. He urges Israel to keep the commandments. The Ten Commandments are repeated. The Shema is proclaimed. Moses urges the people to love God.", number: 45 },
  "Eikev": { hebrew: "עֵקֶב", book: "Devarim", verses: "7:12–11:25", summary: "Moses promises blessings for following God's commandments. He warns against forgetting God after entering the prosperous land. He recounts the sin of the Golden Calf and the new tablets.", number: 46 },
  "Re'eh": { hebrew: "רְאֵה", book: "Devarim", verses: "11:26–16:17", summary: "Moses presents a blessing and a curse based on obedience. Laws about the chosen place of worship, false prophets, dietary laws, tithes, the Sabbatical year, and the three pilgrimage festivals.", number: 47 },
  "Shoftim": { hebrew: "שֹׁפְטִים", book: "Devarim", verses: "16:18–21:9", summary: "Laws for judges, kings, Levites, and prophets are given. Cities of refuge are described. Rules of warfare, including exemptions and prohibited practices. The unsolved murder ritual.", number: 48 },
  "Ki Teitzei": { hebrew: "כִּי-תֵצֵא", book: "Devarim", verses: "21:10–25:19", summary: "The largest single concentration of mitzvot: laws covering family, property, sexual ethics, the treatment of others, business practices, and many more. 'Do not forget what Amalek did.'", number: 49 },
  "Ki Tavo": { hebrew: "כִּי-תָבוֹא", book: "Devarim", verses: "26:1–29:8", summary: "Laws of first fruits and tithes. The covenant renewal ceremony at Mounts Gerizim and Ebal. The lengthy tochecha—blessings for obedience and terrible curses for disobedience.", number: 50 },
  "Nitzavim": { hebrew: "נִצָּבִים", book: "Devarim", verses: "29:9–30:20", summary: "Moses gathers all Israel for a covenant renewal. He assures them that repentance is always possible. The commandment is not in heaven but in our mouths and hearts. Choose life.", number: 51 },
  "Vayeilech": { hebrew: "וַיֵּלֶךְ", book: "Devarim", verses: "31:1–31:30", summary: "Moses announces he is 120 years old and will not cross the Jordan. He transfers leadership to Joshua. He writes the Torah and commands it be read every seven years at Sukkot.", number: 52 },
  "Ha'azinu": { hebrew: "הַאֲזִינוּ", book: "Devarim", verses: "32:1–32:52", summary: "Moses recites a poetic song reviewing Israel's history and God's relationship with the people—their rebellion, punishment, and eventual redemption. God tells Moses to ascend Mount Nebo to see Canaan.", number: 53 },
  "Vezot Haberakhah": { hebrew: "וְזֹאת הַבְּרָכָה", book: "Devarim", verses: "33:1–34:12", summary: "Moses blesses each of the twelve tribes individually. Then Moses ascends Mount Nebo and dies, looking over the Promised Land. The Torah closes with praise for Moses, the greatest prophet.", number: 54 },
};

// Map @hebcal/core basename() spellings → PARASHA_DATA keys
const HEBCAL_ALIAS: Record<string, string> = {
  "Sh'lach": "Shelach",
  "Beha'alotcha": "Beha'alotcha",
  "Ha'azinu": "Ha'azinu",
  "Vayera": "Vayeira",
  "Re'eh": "Re'eh",
  // combined parashiyot — map to first one (with combined name for display)
  "Nitzavim-Vayeilech": "Nitzavim",
  "Matot-Masei": "Matot",
  "Tazria-Metzora": "Tazria",
  "Achrei Mot-Kedoshim": "Achrei Mot",
  "Behar-Bechukotai": "Behar",
  "Vayakhel-Pekudei": "Vayakhel",
  "Chukat-Balak": "Chukat",
};

function resolveParashaName(raw: string): { key: string; displayName: string } | null {
  const clean = raw.replace(/^Parashat\s+/, "").replace(/^Parasha\s+/, "").trim();
  // Direct match
  if (PARASHA_DATA[clean]) return { key: clean, displayName: clean };
  // Alias lookup
  if (HEBCAL_ALIAS[clean]) return { key: HEBCAL_ALIAS[clean], displayName: clean };
  // Partial match fallback
  for (const key of Object.keys(PARASHA_DATA)) {
    if (key.toLowerCase() === clean.toLowerCase()) return { key, displayName: key };
  }
  return null;
}

export function getCurrentParasha(date: Date = new Date()): ParashaInfo | null {
  try {
    const events = HebrewCalendar.calendar({
      start: date,
      end: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
      il: true,
      isHebrewYear: false,
      sedrot: true,
      mask: flags.PARSHA_HASHAVUA,
    });

    for (const ev of events) {
      const raw = ev.basename ? ev.basename() : ev.render("en");
      const resolved = resolveParashaName(raw);
      if (!resolved) continue;
      const data = PARASHA_DATA[resolved.key];
      if (!data) continue;
      return {
        name: resolved.displayName,
        hebrewName: data.hebrew,
        book: data.book,
        verses: data.verses,
        summary: data.summary,
        number: data.number,
        total: 54,
      };
    }
  } catch (e) {
    console.error("Error getting parasha:", e);
  }
  return null;
}

export function getUpcomingParashiyot(date: Date = new Date(), count = 5): Array<{ name: string; date: Date; hebrewName: string }> {
  try {
    const endDate = new Date(date.getTime() + count * 7 * 24 * 60 * 60 * 1000);
    const events = HebrewCalendar.calendar({
      start: date,
      end: endDate,
      il: true,
      isHebrewYear: false,
      sedrot: true,
      mask: flags.PARSHA_HASHAVUA,
    });

    return events.slice(0, count).map(ev => {
      const raw = ev.basename ? ev.basename() : ev.render("en");
      const resolved = resolveParashaName(raw);
      const data = resolved ? PARASHA_DATA[resolved.key] : undefined;
      return {
        name: resolved?.displayName ?? raw,
        date: ev.getDate().greg(),
        hebrewName: data?.hebrew ?? "",
      };
    });
  } catch (e) {
    return [];
  }
}

export function getUpcomingHolidays(date: Date = new Date(), count = 5): Array<{ name: string; date: Date }> {
  try {
    const endDate = new Date(date.getTime() + 120 * 24 * 60 * 60 * 1000);
    const events = HebrewCalendar.calendar({
      start: date,
      end: endDate,
      il: true,
      isHebrewYear: false,
      mask:
        flags.CHAG |
        flags.ROSH_CHODESH |
        flags.MODERN_HOLIDAY |
        flags.MINOR_FAST |
        flags.MAJOR_FAST |
        flags.MINOR_HOLIDAY |
        flags.YOM_TOV,
    });
    return events.slice(0, count).map(ev => ({
      name: ev.render("en"),
      date: ev.getDate().greg(),
    }));
  } catch (e) {
    return [];
  }
}
