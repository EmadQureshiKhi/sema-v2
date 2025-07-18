import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key exists:', !!supabaseAnonKey)
console.log('Supabase Anon Key length:', supabaseAnonKey?.length)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface QuestionnaireTemplate {
  id: string
  name: string
  topics: Topic[]
  client_id?: string
  created_at: string
  updated_at?: string
}

export interface Topic {
  id: string
  name: string
  description: string
  category: 'Economic' | 'Environmental' | 'Social'
}

export interface QuestionnaireInstance {
  id: string
  template_id: string
  recipient_email: string
  recipient_name?: string
  unique_link_token: string
  status: 'sent' | 'opened' | 'completed' | 'expired'
  sent_at: string
  opened_at?: string
  completed_at?: string
  client_id?: string
  created_at: string
}

export interface QuestionnaireResponse {
  id: string
  instance_id: string
  topic_id: string
  topic_name: string
  topic_category: string
  score: number
  comments?: string
  submitted_at: string
}

export interface ClientContact {
  id: string
  client_id: string
  email: string
  name?: string
  stakeholder_group?: string
  created_at: string
  updated_at: string
}

// Database service functions
export const templateService = {
  // Get all templates
  async getTemplates(clientId?: string) {
    try {
      let query = supabase
        .from('questionnaire_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Only filter by client_id if it's a valid UUID format
      if (clientId && clientId !== 'demo' && !clientId.startsWith('client_')) {
        query = query.or(`client_id.eq.${clientId},client_id.is.null`)
      } else {
        // For demo client or non-UUID client IDs, only get global templates
        query = query.is('client_id', null)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Supabase query error:', error)
        throw new Error(`Database query failed: ${error.message}`)
      }
      
      return data as QuestionnaireTemplate[]
    } catch (error) {
      console.error('Error in getTemplates:', error)
      // Return empty array instead of throwing to prevent app crashes
      return []
    }
  },

  // Create new template
  async createTemplate(template: Omit<QuestionnaireTemplate, 'id' | 'created_at'>) {
    try {
      // Don't save templates for demo or non-UUID clients
      if (template.client_id === 'demo' || (template.client_id && template.client_id.startsWith('client_'))) {
        throw new Error('Templates cannot be saved for demo or local clients. Please connect to Supabase first.');
      }

      const { data, error } = await supabase
        .from('questionnaire_templates')
        .insert([template])
        .select()
        .single()
      
      if (error) {
        console.error('Supabase insert error:', error)
        throw new Error(`Failed to create template: ${error.message}`)
      }
      return data as QuestionnaireTemplate
    } catch (error) {
      console.error('Error in createTemplate:', error)
      throw error
    }
  },

  // Update template
  async updateTemplate(id: string, updates: Partial<QuestionnaireTemplate>) {
    try {
      const { data, error } = await supabase
        .from('questionnaire_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase update error:', error)
        throw new Error(`Failed to update template: ${error.message}`)
      }
      return data as QuestionnaireTemplate
    } catch (error) {
      console.error('Error in updateTemplate:', error)
      throw error
    }
  },

  // Delete template
  async deleteTemplate(id: string) {
    try {
      const { error } = await supabase
        .from('questionnaire_templates')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Supabase delete error:', error)
        throw new Error(`Failed to delete template: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in deleteTemplate:', error)
      throw error
    }
  }
}

export const instanceService = {
  // Get instances for a client
  async getInstances(clientId: string) {
    const { data, error } = await supabase
      .from('questionnaire_instances')
      .select(`
        *,
        questionnaire_templates(name)
      `)
      .eq('client_id', clientId)
      .order('sent_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create new instance
  async createInstance(instance: Omit<QuestionnaireInstance, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('questionnaire_instances')
      .insert([instance])
      .select()
      .single()
    
    if (error) throw error
    return data as QuestionnaireInstance
  }
}

export const responseService = {
  // Get responses for a client
  async getResponses(clientId: string) {
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select(`
        *,
        questionnaire_instances!inner(
          client_id,
          recipient_email,
          questionnaire_templates(name)
        )
      `)
      .eq('questionnaire_instances.client_id', clientId)
      .order('submitted_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get aggregated response summary
  async getResponseSummary(clientId: string) {
    const { data, error } = await supabase
      .from('questionnaire_response_summary')
      .select('*')
      .eq('client_id', clientId)
    
    if (error) throw error
    return data
  }
}

export const contactService = {
  // Get contacts for a client
  async getContacts(clientId: string) {
    const { data, error } = await supabase
      .from('client_contacts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as ClientContact[]
  },

  // Create new contact
  async createContact(contact: Omit<ClientContact, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('client_contacts')
      .insert([contact])
      .select()
      .single()
    
    if (error) throw error
    return data as ClientContact
  },

  // Update contact
  async updateContact(id: string, updates: Partial<ClientContact>) {
    const { data, error } = await supabase
      .from('client_contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as ClientContact
  },

  // Delete contact
  async deleteContact(id: string) {
    const { error } = await supabase
      .from('client_contacts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}