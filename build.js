const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  jsFiles: ['main.js', 'analytics.js'],
  cssFiles: ['style.css', 'responsive.css'],
  inputDir: './',
  outputDir: './dist/protected/'
};

// Créer le dossier de sortie
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Fonction de minification JS
function minifyJS(inputFile, outputFile) {
  try {
    const command = `terser "${inputFile}" -o "${outputFile}" -c defaults,unsafe=true,drop_console=true -m toplevel,rename=true`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ Minifié: ${inputFile} -> ${outputFile}`);
  } catch (error) {
    console.error(`✗ Erreur sur ${inputFile}:`, error.message);
  }
}

// Fonction de minification CSS
function minifyCSS(inputFile, outputFile) {
  try {
    const command = `cleancss -O2 -o "${outputFile}" "${inputFile}"`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ Minifié: ${inputFile} -> ${outputFile}`);
  } catch (error) {
    console.error(`✗ Erreur sur ${inputFile}:`, error.message);
  }
}

// Obfuscation avancée avec JavaScript Obfuscator
function obfuscateJS(inputFile, outputFile) {
  try {
    const JavaScriptObfuscator = require('javascript-obfuscator');
    const code = fs.readFileSync(inputFile, 'utf8');
    
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 4000,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayEncoding: ['rc4'],
      stringArrayIndexShift: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 4,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    });
    
    fs.writeFileSync(outputFile, obfuscated.getObfuscatedCode());
    console.log(`✓ Obfusqué: ${inputFile} -> ${outputFile}`);
  } catch (error) {
    console.error(`✗ Erreur d'obfuscation sur ${inputFile}:`, error.message);
  }
}

// Traitement des fichiers
console.log('🚀 Début de la minification et obfuscation...\n');

// Minification CSS
config.cssFiles.forEach(file => {
  const inputPath = path.join(config.inputDir, 'css', file);
  const outputPath = path.join(config.outputDir, 'css', file.replace('.css', '.min.css'));
  
  if (fs.existsSync(inputPath)) {
    minifyCSS(inputPath, outputPath);
  }
});

// Minification et obfuscation JS
config.jsFiles.forEach(file => {
  const inputPath = path.join(config.inputDir, 'js', file);
  const obfuscatedPath = path.join(config.outputDir, 'js', file.replace('.js', '.obf.js'));
  
  if (fs.existsSync(inputPath)) {
    obfuscateJS(inputPath, obfuscatedPath);
  }
});

console.log('\n✅ Tous les fichiers ont été traités!');