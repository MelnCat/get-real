import sharp from "sharp";
sharp("./test.svg").png().toFile("./out.png")