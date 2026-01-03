<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dashboard - Cervi Bazar</title>
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
<body class="bg-background-light dark:bg-background-dark min-h-screen flex font-display text-text-main dark:text-white overflow-hidden selection:bg-secondary selection:text-text-main">
<aside class="w-72 bg-surface-light dark:bg-surface-dark border-r border-[#e6e1e8] dark:border-[#452b4d] hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 transition-transform">
<div class="p-6 flex items-center justify-center border-b border-[#e6e1e8] dark:border-[#452b4d] h-24">
<img alt="Cervi Bazar Logo" class="h-14 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkgApdwVRd0ksyEPnKlKI4_M4-IE8B_fKjOG87lJbZz2BfzSV3z-27JxwPpyTUxnVOL6b7z40EkYiz3hA7wErvD4UXAqx_Kto3tQYi68YvouVz2cCIySPrcmLvBY37kvzw_RDoEYaf5jUkoGb4aZ6GKxFC7csNzxdxfWgdi1xiPRSFpZUGCBXG94ESnJeDDHkHvOEYp4_xSofXS4aHvAFm161M9IDRK2wd7XN4i4Om5RdQHGKsFeBwwVwot2Ir6YuXVgdbj3ppL1-t"/>
</div>
<nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
<a class="flex items-center gap-3 px-4 py-3 text-text-secondary dark:text-[#bcaec4] hover:bg-primary/5 dark:hover:bg-[#452b4d] hover:text-primary dark:hover:text-white rounded-xl transition-all group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">point_of_sale</span>
<span class="font-bold text-sm">Frente de Caixa</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary dark:text-white rounded-xl transition-all shadow-sm" href="#">
<span class="material-symbols-outlined">lock_open</span>
<span class="font-bold text-sm">Abertura de Caixa</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-text-secondary dark:text-[#bcaec4] hover:bg-primary/5 dark:hover:bg-[#452b4d] hover:text-primary dark:hover:text-white rounded-xl transition-all group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">lock</span>
<span class="font-bold text-sm">Fechamento de Caixa</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-text-secondary dark:text-[#bcaec4] hover:bg-primary/5 dark:hover:bg-[#452b4d] hover:text-primary dark:hover:text-white rounded-xl transition-all group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">remove_circle_outline</span>
<span class="font-bold text-sm">Sangria de Caixa</span>
</a>
<div class="my-4 border-t border-[#e6e1e8] dark:border-[#452b4d]"></div>
<p class="px-4 text-xs font-bold text-text-secondary/60 uppercase tracking-widest mb-2">Administração</p>
<a class="flex items-center gap-3 px-4 py-3 text-text-secondary dark:text-[#bcaec4] hover:bg-primary/5 dark:hover:bg-[#452b4d] hover:text-primary dark:hover:text-white rounded-xl transition-all group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">bar_chart</span>
<span class="font-bold text-sm">Relatórios de Vendas</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-text-secondary dark:text-[#bcaec4] hover:bg-primary/5 dark:hover:bg-[#452b4d] hover:text-primary dark:hover:text-white rounded-xl transition-all group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">manage_accounts</span>
<span class="font-bold text-sm">Gerenciamento de Usuários</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-text-secondary dark:text-[#bcaec4] hover:bg-primary/5 dark:hover:bg-[#452b4d] hover:text-primary dark:hover:text-white rounded-xl transition-all group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">edit_note</span>
<span class="font-bold text-sm">Motivos de Sangria</span>
</a>
</nav>
<div class="p-4 border-t border-[#e6e1e8] dark:border-[#452b4d]">
<button class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] text-text-secondary hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors text-sm font-bold">
<span class="material-symbols-outlined text-[20px]">logout</span>
                Sair do Sistema
            </button>
</div>
</aside>
<div class="flex-1 flex flex-col h-screen lg:ml-72 transition-all">
<header class="h-24 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-[#e6e1e8] dark:border-[#452b4d] flex items-center justify-between px-6 sticky top-0 z-30">
<div class="flex items-center gap-4">
<button class="lg:hidden p-2 rounded-lg hover:bg-background-light dark:hover:bg-[#452b4d] text-text-secondary">
<span class="material-symbols-outlined">menu</span>
</button>
<h1 class="text-xl md:text-2xl font-bold text-text-main dark:text-white">Dashboard</h1>
</div>
<div class="flex items-center gap-4">
<div class="hidden sm:flex flex-col items-end mr-2">
<span class="text-sm font-bold text-text-main dark:text-white">Admin User</span>
<span class="text-xs text-text-secondary">Gerente</span>
</div>
<button class="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-[20px]">person</span>
</button>
</div>
</header>
<main class="flex-1 p-6 md:p-8 overflow-y-auto bg-background-light dark:bg-background-dark">
<div class="w-full h-full rounded-3xl border-2 border-dashed border-[#e6e1e8] dark:border-[#452b4d] flex flex-col items-center justify-center p-8 text-center bg-surface-light/30 dark:bg-surface-dark/30">
<div class="size-20 rounded-full bg-background-light dark:bg-[#382240] flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-4xl text-text-secondary/40 dark:text-[#bcaec4]/40">dashboard_customize</span>
</div>
<h3 class="text-xl font-bold text-text-secondary dark:text-[#bcaec4] mb-2">Área de Trabalho</h3>
<p class="text-text-secondary/60 dark:text-[#bcaec4]/60 max-w-md">Selecione uma opção no menu lateral para começar a gerenciar o sistema.</p>
</div>
</main>
</div>

</body></html>
