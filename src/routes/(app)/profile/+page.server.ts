import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { account } from '$lib/server/db/auth.schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const [credentialAccount] = await db
        .select({ id: account.id })
        .from(account)
        .where(and(eq(account.userId, locals.user.id), eq(account.providerId, 'credential')))
        .limit(1);

    return {
        user: locals.user,
        hasPassword: !!credentialAccount
    };
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) throw redirect(303, '/login');

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const image = formData.get('image') as string;

        await db.update(users)
            .set({ name, image, updatedAt: new Date() })
            .where(eq(users.id, locals.user.id));

        return { success: true };
    }
};
