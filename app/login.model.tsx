
<!DOCTYPE html>
<html lang="pt-BR"><head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>Login - Cervi Bazar</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script id="tailwind-config">
          tailwind.config = {
                      darkMode: "class",
                                  theme: {
                                                  extend: {
                                                                      colors: {
                                                                                              "primary": "#92278f", 
                                                                                                                      "primary-hover": "#7a1e76",
                                                                                                                                              "secondary": "#8bc4f0", 
                                                                                                                                                                      "accent": "#4a9c8a", 
                                                                                                                                                                                              "background-light": "#f8f9fa",
                                                                                                                                                                                                                      "background-dark": "#1a101d",
                                                                                                                                                                                                                                              "surface-light": "#ffffff",
                                                                                                                                                                                                                                                                      "surface-dark": "#2d1b33",
                                                                                                                                                                                                                                                                                              "text-main": "#2d1b33",
                                                                                                                                                                                                                                                                                                                      "text-secondary": "#6b5a75",
                                                                                                                                                                                                                                                                                                                                          },
                                                                                                                                                                                                                                                                                                                                                              fontFamily: {
                                                                                                                                                                                                                                                                                                                                                                                      "display": ["Manrope", "sans-serif"]
                                                                                                                                                                                                                                                                                                                                                                                                          },
                                                                                                                                                                                                                                                                                                                                                                                                                              borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                                                                                                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                                                                                                                          },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </script>
    </head>
    <body class="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-white overflow-x-hidden selection:bg-secondary selection:text-text-main">
    <main class="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6">
    <div class="w-full max-w-lg space-y-6">
    <section class="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 sm:p-10 shadow-xl border border-[#e6e1e8] dark:border-[#452b4d]">
    <div class="flex flex-col items-center text-center mb-10">
    <img alt="Cervi Bazar Logo" class="h-20 w-auto object-contain mb-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkgApdwVRd0ksyEPnKlKI4_M4-IE8B_fKjOG87lJbZz2BfzSV3z-27JxwPpyTUxnVOL6b7z40EkYiz3hA7wErvD4UXAqx_Kto3tQYi68YvouVz2cCIySPrcmLvBY37kvzw_RDoEYaf5jUkoGb4aZ6GKxFC7csNzxdxfWgdi1xiPRSFpZUGCBXG94ESnJeDDHkHvOEYp4_xSofXS4aHvAFm161M9IDRK2wd7XN4i4Om5RdQHGKsFeBwwVwot2Ir6YuXVgdbj3ppL1-t"/>
    <h2 class="text-2xl md:text-3xl font-black tracking-tight text-text-main dark:text-white">Acessar Sistema</h2>
            <p class="text-text-secondary dark:text-[#bcaec4] mt-2 text-sm max-w-xs mx-auto">Bem-vindo ao Cervi Bazar. Insira suas credenciais para continuar.</p>
            </div>
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-bold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Username</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">person</span>
                <input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium text-base transition-all placeholder:text-text-secondary/40 placeholder:font-normal" placeholder="Digite seu usuário" type="text"/>
                </div>
              </div>
            <div>
              <label class="block text-sm font-bold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Senha</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">key</span>
                <input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium text-base transition-all placeholder:text-text-secondary/40 placeholder:font-normal" placeholder="••••••••" type="password"/>
                </div>
              </div>
            <div class="pt-4">
              <button class="w-full h-14 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2" type="submit">
                <span class="material-symbols-outlined">login</span>
                                            Entrar
                                        </button>
              </div>
            </form>
          </section>
        </div>
      </main>

    </body></html>



