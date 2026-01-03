<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Gerenciamento de Usuários - Cervi Bazar</title>
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
<p class="text-xs font-medium text-text-secondary dark:text-[#bcaec4] uppercase tracking-wider hidden sm:block">Painel Administrativo</p>
</div>
</div>
<div class="flex items-center gap-3">
<button class="hidden md:flex items-center gap-2 px-4 h-10 rounded-full text-sm font-bold text-text-secondary hover:bg-primary/5 dark:hover:bg-[#452b4d] transition-colors">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
                Voltar ao Caixa
            </button>
<button class="flex items-center justify-center size-10 rounded-full border border-[#e6e1e8] dark:border-[#452b4d] hover:bg-primary/5 dark:hover:bg-[#452b4d] text-text-secondary transition-colors">
<span class="material-symbols-outlined">logout</span>
</button>
</div>
</div>
</header>
<main class="flex-grow py-8 px-4 sm:px-6">
<div class="max-w-6xl mx-auto space-y-6">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 class="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white">Gerenciar Usuários</h2>
<p class="text-text-secondary dark:text-[#bcaec4] mt-1">Cadastre e controle o acesso dos operadores ao sistema.</p>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
<section class="lg:col-span-4 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-[#e6e1e8] dark:border-[#452b4d] sticky top-24">
<div class="flex items-center gap-2 mb-6 text-text-main dark:text-white border-b border-[#e6e1e8] dark:border-[#452b4d] pb-4">
<span class="material-symbols-outlined text-primary">person_add</span>
<h3 class="text-lg font-bold">Dados do Usuário</h3>
</div>
<form class="space-y-4">
<div>
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Nome Completo</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">badge</span>
<input class="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" placeholder="Nome Completo" type="text"/>
</div>
</div>
<div>
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Login de Acesso</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">alternate_email</span>
<input class="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" placeholder="nome.sobrenome" type="text"/>
</div>
<p class="text-xs text-text-secondary/60 mt-1 ml-1">Formato sugerido: primeiro.ultimo</p>
</div>
<div>
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Senha</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">lock</span>
<input class="w-full h-12 pl-12 pr-12 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" placeholder="••••••••" type="password"/>
<button class="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<div>
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Confirmação de Senha</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">lock_reset</span>
<input class="w-full h-12 pl-12 pr-12 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all placeholder:text-text-secondary/50" placeholder="••••••••" type="password"/>
<button class="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<div>
<label class="block text-sm font-semibold mb-2 ml-1 text-text-secondary dark:text-[#bcaec4]">Perfil</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary transition-colors group-focus-within:text-primary">badge</span>
<select class="w-full h-12 pl-12 pr-10 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-medium transition-all appearance-none cursor-pointer">
<option disabled="" selected="" value="">Selecione um perfil</option>
<option value="admin">Administrador</option>
<option value="caixa">Operador de Caixa</option>
</select>
<span class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary pointer-events-none">expand_more</span>
</div>
</div>
<div class="pt-4 flex flex-col gap-3">
<button class="w-full h-12 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white rounded-xl font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2" type="submit">
<span class="material-symbols-outlined">save</span>
                            Salvar Usuário
                        </button>
<button class="w-full h-12 bg-transparent hover:bg-background-light dark:hover:bg-[#382240] border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] text-text-secondary transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2" type="button">
                            Cancelar
                        </button>
</div>
</form>
</section>
<section class="lg:col-span-8 space-y-4">
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm border border-[#e6e1e8] dark:border-[#452b4d]">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-background-light dark:bg-background-dark text-text-secondary dark:text-[#bcaec4] text-xs uppercase tracking-wider border-b border-[#e6e1e8] dark:border-[#452b4d]">
<th class="p-5 font-bold">Usuário</th>
<th class="p-5 font-bold">Login</th>
<th class="p-5 font-bold">Perfil</th>
<th class="p-5 font-bold text-right">Ações</th>
</tr>
</thead>
<tbody class="divide-y divide-[#e6e1e8] dark:divide-[#452b4d]">
<tr class="group hover:bg-primary/5 dark:hover:bg-[#382240] transition-colors">
<td class="p-5">
<div class="flex items-center gap-3">
<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                AS
                                            </div>
<div>
<p class="font-bold text-text-main dark:text-white">Ana Silva</p>
</div>
</div>
</td>
<td class="p-5">
<span class="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">ana.silva</span>
</td>
<td class="p-5">
<div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20">
<span class="material-symbols-outlined text-[14px]">point_of_sale</span>
                                            Caixa
                                        </div>
</td>
<td class="p-5 text-right">
<div class="flex items-center justify-end gap-2">
<button class="size-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] transition-all" title="Editar">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
<button class="size-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] transition-all" title="Excluir">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<tr class="group hover:bg-primary/5 dark:hover:bg-[#382240] transition-colors">
<td class="p-5">
<div class="flex items-center gap-3">
<div class="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                                                RC
                                            </div>
<div>
<p class="font-bold text-text-main dark:text-white">Roberto Costa</p>
</div>
</div>
</td>
<td class="p-5">
<span class="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">roberto.costa</span>
</td>
<td class="p-5">
<div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
<span class="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                                            Admin
                                        </div>
</td>
<td class="p-5 text-right">
<div class="flex items-center justify-end gap-2">
<button class="size-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] transition-all">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
<button class="size-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] transition-all">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<tr class="group hover:bg-primary/5 dark:hover:bg-[#382240] transition-colors">
<td class="p-5">
<div class="flex items-center gap-3">
<div class="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                                                MJ
                                            </div>
<div>
<p class="font-bold text-text-main dark:text-white">Maria Julia</p>
</div>
</div>
</td>
<td class="p-5">
<span class="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">maria.julia</span>
</td>
<td class="p-5">
<div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20">
<span class="material-symbols-outlined text-[14px]">point_of_sale</span>
                                            Caixa
                                        </div>
</td>
<td class="p-5 text-right">
<div class="flex items-center justify-end gap-2">
<button class="size-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] transition-all">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
<button class="size-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm border border-transparent hover:border-[#e6e1e8] dark:hover:border-[#452b4d] transition-all">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div class="p-4 border-t border-[#e6e1e8] dark:border-[#452b4d] flex items-center justify-between">
<p class="text-sm text-text-secondary dark:text-[#bcaec4]">Mostrando <span class="font-bold text-text-main dark:text-white">3</span> de <span class="font-bold text-text-main dark:text-white">12</span> usuários</p>
<div class="flex gap-2">
<button class="size-8 flex items-center justify-center rounded-lg border border-[#e6e1e8] dark:border-[#452b4d] text-text-secondary hover:bg-primary/5 dark:hover:bg-[#382240] transition-colors disabled:opacity-50" disabled="">
<span class="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button class="size-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm shadow-md shadow-primary/20">1</button>
<button class="size-8 flex items-center justify-center rounded-lg border border-[#e6e1e8] dark:border-[#452b4d] text-text-secondary hover:bg-primary/5 dark:hover:bg-[#382240] transition-colors">2</button>
<button class="size-8 flex items-center justify-center rounded-lg border border-[#e6e1e8] dark:border-[#452b4d] text-text-secondary hover:bg-primary/5 dark:hover:bg-[#382240] transition-colors">
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
</section>
</div>
</div>
</main>
</body></html>
