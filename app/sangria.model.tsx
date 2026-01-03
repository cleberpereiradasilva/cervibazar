<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Formulário de Sangria - Cervi Bazar</title>
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
<header class="sticky top-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-[#e6e1e8] dark:border-[#452b4d] px-6 py-3">
<div class="max-w-6xl mx-auto flex items-center justify-between">
<div class="flex items-center gap-4">
<img alt="Cervi Bazar Logo" class="h-16 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkgApdwVRd0ksyEPnKlKI4_M4-IE8B_fKjOG87lJbZz2BfzSV3z-27JxwPpyTUxnVOL6b7z40EkYiz3hA7wErvD4UXAqx_Kto3tQYi68YvouVz2cCIySPrcmLvBY37kvzw_RDoEYaf5jUkoGb4aZ6GKxFC7csNzxdxfWgdi1xiPRSFpZUGCBXG94ESnJeDDHkHvOEYp4_xSofXS4aHvAFm161M9IDRK2wd7XN4i4Om5RdQHGKsFeBwwVwot2Ir6YuXVgdbj3ppL1-t"/>
<div>
<p class="text-xs font-medium text-text-secondary dark:text-[#bcaec4] uppercase tracking-wider hidden sm:block">Frente de Caixa</p>
</div>
</div>
<div class="flex items-center gap-3">
<button class="hidden md:flex items-center gap-2 px-4 h-10 rounded-full text-sm font-bold text-text-secondary hover:bg-primary/5 dark:hover:bg-[#452b4d] transition-colors">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
                Voltar ao Painel
            </button>
<button class="flex items-center justify-center size-10 rounded-full border border-[#e6e1e8] dark:border-[#452b4d] hover:bg-primary/5 dark:hover:bg-[#452b4d] text-text-secondary transition-colors">
<span class="material-symbols-outlined">logout</span>
</button>
</div>
</div>
</header>
<main class="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6">
<div class="w-full max-w-md space-y-6">
<section class="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-[#e6e1e8] dark:border-[#452b4d]">
<div class="flex flex-col items-center text-center mb-8">
<div class="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-[32px]">remove_shopping_cart</span>
</div>
<h2 class="text-2xl md:text-3xl font-black tracking-tight text-text-main dark:text-white">Sangria de Caixa</h2>
<p class="text-text-secondary dark:text-[#bcaec4] mt-2">Informe o motivo e o valor a ser retirado.</p>
</div>
<form class="space-y-6">
<div>
<label class="block text-sm font-bold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Motivo</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">format_list_bulleted</span>
<select class="w-full h-14 pl-12 pr-12 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-lg transition-all appearance-none cursor-pointer">
<option disabled="" selected="" value="">Selecione o motivo</option>
<option value="deposito">Depósito Bancário</option>
<option value="pagamento">Pagamento de Contas</option>
<option value="transporte">Transporte/Logística</option>
<option value="excesso">Excesso de Caixa</option>
<option value="outro">Outros</option>
</select>
<span class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary pointer-events-none">expand_more</span>
</div>
</div>
<div>
<label class="block text-sm font-bold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Valor da Retirada</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">payments</span>
<input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-lg transition-all placeholder:text-text-secondary/40 placeholder:font-normal" inputmode="decimal" placeholder="R$ 0,00" type="text"/>
</div>
</div>
<div class="pt-2 flex flex-col gap-3">
<button class="w-full h-14 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2" type="submit">
<span class="material-symbols-outlined">check_circle</span>
                        Confirmar Sangria
                    </button>
<button class="w-full h-12 bg-transparent hover:bg-background-light dark:hover:bg-[#382240] border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] text-text-secondary transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2" type="button">
                        Cancelar
                    </button>
</div>
</form>
</section>
</div>
</main>
</body></html>


