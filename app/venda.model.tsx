<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Formulário de Vendas Bazar</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#92278f", // Extracted purple from logo
                        "primary-hover": "#7a1e76",
                        "secondary": "#8bc4f0", // Extracted light blue from logo
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
<p class="text-xs font-medium text-text-secondary dark:text-[#bcaec4] uppercase tracking-wider hidden sm:block">Terminal de Caixa</p>
</div>
</div>
<div class="flex items-center gap-3">
<button class="hidden md:flex items-center gap-2 px-4 h-10 rounded-full text-sm font-bold text-text-secondary hover:bg-primary/5 dark:hover:bg-[#452b4d] transition-colors">
<span class="material-symbols-outlined text-[20px]">history</span>
                    Histórico
                </button>
<button class="flex items-center justify-center size-10 rounded-full border border-[#e6e1e8] dark:border-[#452b4d] hover:bg-primary/5 dark:hover:bg-[#452b4d] text-text-secondary transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
</div>
</header>
<main class="flex-grow py-8 px-4 sm:px-6">
<div class="max-w-6xl mx-auto space-y-6">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 class="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white">Nova Venda</h2>
<p class="text-text-secondary dark:text-[#bcaec4] mt-1">Preencha os itens para calcular o total.</p>
</div>
<div class="bg-white dark:bg-surface-dark px-4 py-2 rounded-full border border-primary/20 shadow-sm flex items-center gap-2">
<div class="size-2 rounded-full bg-green-500 animate-pulse"></div>
<span class="text-sm font-bold text-text-main dark:text-white">Caixa Aberto</span>
</div>
</div>
<section class="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-[#e6e1e8] dark:border-[#452b4d]">
<div class="flex items-center gap-2 mb-6 text-text-main dark:text-white">
<span class="material-symbols-outlined text-primary">person</span>
<h3 class="text-lg font-bold">Dados do Cliente</h3>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
<div class="md:col-span-3">
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Celular (WhatsApp)</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary">smartphone</span>
<input class="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" placeholder="(00) 00000-0000" type="tel"/>
</div>
</div>
<div class="md:col-span-6">
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Nome Completo</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary">badge</span>
<input class="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" placeholder="Nome do cliente" type="text"/>
</div>
</div>
<div class="md:col-span-3">
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Data de Nascimento</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary">cake</span>
<input class="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" type="date"/>
</div>
</div>
</div>
</section>
<section class="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-[#e6e1e8] dark:border-[#452b4d]">
<div class="flex items-center justify-between mb-6">
<div class="flex items-center gap-2 text-text-main dark:text-white">
<span class="material-symbols-outlined text-primary">shopping_bag</span>
<h3 class="text-lg font-bold">Produtos</h3>
</div>
<span class="text-xs font-bold bg-secondary/20 text-text-main dark:text-white px-3 py-1 rounded-full">9 Categorias</span>
</div>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">checkroom</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">INF/CALÇADOS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">remove</span>
</button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl text-text-main dark:text-white font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">toys</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">BRINQUEDOS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">man</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">MASC/CALÇADOS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">woman</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">FEM/CALÇADOS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="1"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" type="number" value="25.00"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white">R$ 25,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">watch</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">ACESSÓRIOS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">diamond</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">BIJUS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="2"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" type="number" value="5.00"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white">R$ 10,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">menu_book</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">LIVROS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">chair</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">DECOR. CASA</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
<div class="group relative bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-[#382240] rounded-2xl p-4 transition-colors border border-transparent hover:border-primary/30">
<div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div class="w-full md:col-span-4 flex items-center gap-3">
<div class="size-8 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">category</span>
</div>
<span class="font-bold text-text-main dark:text-white text-sm">OUTROS</span>
</div>
<div class="w-full md:col-span-3 flex md:justify-center">
<div class="flex items-center justify-center w-full max-w-[120px] bg-white dark:bg-surface-dark rounded-xl border border-[#e6e1e8] dark:border-[#452b4d] overflow-hidden">
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
<div class="flex-1 flex items-center justify-center">
<input class="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none" type="number" value="0"/>
</div>
<button class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d] active:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
</div>
</div>
<div class="w-full md:col-span-3">
<div class="relative w-full">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">R$</span>
<input class="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-dark border border-[#e6e1e8] dark:border-[#452b4d] rounded-xl font-medium focus:border-primary focus:ring-0" placeholder="000,00" type="number"/>
</div>
</div>
<div class="w-full md:col-span-2 flex justify-between md:justify-end items-center">
<span class="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">Total:</span>
<span class="font-bold text-text-main dark:text-white opacity-40 group-hover:opacity-100">R$ 0,00</span>
</div>
</div>
</div>
</div>
</section>
<section class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-[#e6e1e8] dark:border-[#452b4d] flex flex-col h-full">
<div class="flex items-center gap-2 mb-6 text-text-main dark:text-white">
<span class="material-symbols-outlined text-primary">payments</span>
<h3 class="text-lg font-bold">Formas de Pagamento</h3>
</div>
<div class="flex-grow space-y-4">
<div class="flex items-center gap-3">
<div class="w-24 md:w-32 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-[#bcaec4]">
<span class="material-symbols-outlined text-[18px]">credit_card</span>
                                CRÉDITO
                            </div>
<div class="flex-grow flex gap-2">
<div class="relative flex-grow">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-base font-medium">R$</span>
<input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-xl" placeholder="000,00" type="text"/>
</div>
<button class="px-4 h-14 rounded-2xl bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm">Total</button>
</div>
</div>
<div class="flex items-center gap-3">
<div class="w-24 md:w-32 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-[#bcaec4]">
<span class="material-symbols-outlined text-[18px]">credit_card_heart</span>
                                DÉBITO
                            </div>
<div class="flex-grow flex gap-2">
<div class="relative flex-grow">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-base font-medium">R$</span>
<input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-xl" placeholder="000,00" type="text"/>
</div>
<button class="px-4 h-14 rounded-2xl bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm">Total</button>
</div>
</div>
<div class="flex items-center gap-3">
<div class="w-24 md:w-32 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-[#bcaec4]">
<span class="material-symbols-outlined text-[18px]">attach_money</span>
                                DINHEIRO
                            </div>
<div class="flex-grow flex gap-2">
<div class="relative flex-grow">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-base font-medium">R$</span>
<input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-xl" type="text" value="40,00"/>
</div>
<button class="px-4 h-14 rounded-2xl bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm">Total</button>
</div>
</div>
<div class="flex items-center gap-3">
<div class="w-24 md:w-32 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-[#bcaec4]">
<span class="material-symbols-outlined text-[18px]">photos</span>
                                PIX
                            </div>
<div class="flex-grow flex gap-2">
<div class="relative flex-grow">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-base font-medium">R$</span>
<input class="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-xl" placeholder="000,00" type="text"/>
</div>
<button class="px-4 h-14 rounded-2xl bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm">Total</button>
</div>
</div>
</div>
</div>
<div class="bg-[#2d1b33] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
<div class="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
<div class="absolute bottom-0 left-0 p-32 bg-secondary/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
<div class="space-y-6 relative z-10">
<div class="flex items-center justify-between pb-6 border-b border-white/10">
<span class="text-white/60 font-medium">Total da Venda</span>
<span class="text-4xl font-black tracking-tight">R$ 35,00</span>
</div>
<div class="space-y-2">
<div class="flex items-center justify-between text-sm">
<span class="text-white/60">Total Pago</span>
<span class="font-bold text-secondary">R$ 40,00</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-white/60">Falta Pagar</span>
<span class="font-bold text-white/40">R$ 0,00</span>
</div>
</div>
<div class="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
<span class="font-bold text-lg">Troco</span>
<span class="text-2xl font-black text-secondary">R$ 5,00</span>
</div>
</div>
<div class="pt-8 relative z-10">
<button class="w-full h-14 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white rounded-full font-black text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
<span>Finalizar Venda</span>
<span class="material-symbols-outlined">arrow_forward</span>
</button>
<button class="w-full mt-3 h-10 text-white/40 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
<span class="material-symbols-outlined text-[18px]">restart_alt</span>
                            Limpar Tudo
                        </button>
</div>
</div>
</section>
</div>
</main>
</body></html>
